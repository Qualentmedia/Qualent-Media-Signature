"""Build and parse qbXML requests/responses for QuickBooks Desktop.

This module is pure-Python and has no dependency on Windows or the QuickBooks
SDK, so the request-building and response-parsing logic can be unit tested on
any platform. The COM plumbing lives in ``connection.py``.

qbXML reference: https://developer.intuit.com/app/developer/qbdesktop/docs
"""

from __future__ import annotations

import xml.etree.ElementTree as ET
from typing import Dict, List, Optional
from xml.sax.saxutils import escape

from .entities import EntitySpec, FieldSpec

# qbXML version negotiated with the request processor. 13.0 ships with the
# supported QuickBooks Desktop releases (2019+) and covers every request used
# here; bump only if a newer element is required.
QBXML_VERSION = "13.0"


def _escape(value) -> str:
    return escape("" if value is None else str(value))


def _set_path(root: Dict, path: str, value) -> None:
    """Insert ``value`` into a nested dict following a dotted ``path``.

    ``"BillAddress.Addr1"`` becomes ``{"BillAddress": {"Addr1": value}}``. Order
    of first insertion is preserved, which matters because qbXML is strict about
    element ordering within an aggregate.
    """

    parts = path.split(".")
    node = root
    for part in parts[:-1]:
        node = node.setdefault(part, {})
    node[parts[-1]] = value


def _render(node, indent: int = 0) -> List[str]:
    """Render a nested dict (built by ``_set_path``) into qbXML element lines."""

    pad = "  " * indent
    lines: List[str] = []
    for key, value in node.items():
        if isinstance(value, dict):
            lines.append(f"{pad}<{key}>")
            lines.extend(_render(value, indent + 1))
            lines.append(f"{pad}</{key}>")
        elif isinstance(value, list):
            # Repeated aggregate (e.g. line items): key wraps each element.
            for item in value:
                lines.append(f"{pad}<{key}>")
                lines.extend(_render(item, indent + 1))
                lines.append(f"{pad}</{key}>")
        else:
            lines.append(f"{pad}<{key}>{_escape(value)}</{key}>")
    return lines


def wrap(body: str, on_error: str = "stopOnError") -> str:
    """Wrap one or more request aggregates in the qbXML envelope."""

    return (
        f'<?xml version="1.0" encoding="utf-8"?>\n'
        f'<?qbxml version="{QBXML_VERSION}"?>\n'
        f"<QBXML>\n"
        f'  <QBXMLMsgsRq onError="{on_error}">\n'
        f"{body}\n"
        f"  </QBXMLMsgsRq>\n"
        f"</QBXML>"
    )


def _record_to_tree(spec: EntitySpec, record: Dict) -> Dict:
    """Convert a flat record dict into the nested tree for an Add aggregate."""

    tree: Dict = {}
    missing = [
        f.column for f in spec.fields
        if f.required and not str(record.get(f.column, "")).strip()
    ]
    if missing:
        raise ValueError(
            f"{spec.name}: missing required field(s): {', '.join(missing)}"
        )

    for f in spec.fields:
        value = record.get(f.column)
        if value is None or str(value).strip() == "":
            continue
        _set_path(tree, f.path, value)

    if spec.line_item:
        lines = _extract_lines(spec, record)
        if lines:
            tree[spec.line_item.add_aggregate] = lines
    return tree


def _extract_lines(spec: EntitySpec, record: Dict) -> List[Dict]:
    """Pull repeating line items out of a flat record.

    Two shapes are supported:
      * nested: ``record["lines"] == [{"item": ...}, ...]``
      * flat/CSV: ``line1_item, line1_rate, line2_item, ...``
    """

    li = spec.line_item
    assert li is not None
    lines: List[Dict] = []

    nested = record.get("lines")
    if isinstance(nested, list):
        for raw in nested:
            tree: Dict = {}
            for f in li.fields:
                value = raw.get(f.column)
                if value is None or str(value).strip() == "":
                    continue
                _set_path(tree, f.path, value)
            if tree:
                lines.append(tree)
        return lines

    # Flat columns: line1_item, line1_rate, ...
    index = 1
    while True:
        prefix = f"{li.prefix}{index}_"
        present = any(
            str(record.get(prefix + f.column, "")).strip() for f in li.fields
        )
        if not present:
            break
        tree = {}
        for f in li.fields:
            value = record.get(prefix + f.column)
            if value is None or str(value).strip() == "":
                continue
            _set_path(tree, f.path, value)
        if tree:
            lines.append(tree)
        index += 1
    return lines


def build_add(spec: EntitySpec, record: Dict, request_id: Optional[str] = None) -> str:
    """Build a single Add request aggregate (without the QBXML envelope)."""

    tree = _record_to_tree(spec, record)
    attrs = f' requestID="{_escape(request_id)}"' if request_id else ""
    lines = [f'    <{spec.add_request}{attrs}>']
    lines.append(f"      <{spec.add_aggregate}>")
    lines.extend(_render(tree, indent=4))
    lines.append(f"      </{spec.add_aggregate}>")
    lines.append(f"    </{spec.add_request}>")
    return "\n".join(lines)


def build_add_request(spec: EntitySpec, records: List[Dict], on_error: str = "continueOnError") -> str:
    """Build a full qbXML document that adds many records in one round-trip."""

    bodies = [
        build_add(spec, record, request_id=str(i))
        for i, record in enumerate(records)
    ]
    return wrap("\n".join(bodies), on_error=on_error)


def build_query_request(
    spec: EntitySpec,
    max_returned: Optional[int] = None,
    active_status: str = "All",
    extra: str = "",
) -> str:
    """Build a Query request for exporting records."""

    lines = [f"    <{spec.query_request}>"]
    if spec.kind == "list":
        lines.append(f"      <ActiveStatus>{active_status}</ActiveStatus>")
    if max_returned:
        lines.append(f"      <MaxReturned>{int(max_returned)}</MaxReturned>")
    if extra:
        lines.append(extra)
    lines.append(f"    </{spec.query_request}>")
    return wrap("\n".join(lines))


def build_list_del_request(spec: EntitySpec, list_ids: List[str]) -> str:
    """Delete list objects (Customer/Vendor/Item) by ListID."""

    bodies = []
    for i, list_id in enumerate(list_ids):
        bodies.append(
            f'    <ListDelRq requestID="{i}">\n'
            f"      <ListDelType>{spec.del_type}</ListDelType>\n"
            f"      <ListID>{_escape(list_id)}</ListID>\n"
            f"    </ListDelRq>"
        )
    return wrap("\n".join(bodies), on_error="continueOnError")


def build_txn_del_request(spec: EntitySpec, txn_ids: List[str]) -> str:
    """Delete transactions (Invoice/Bill) by TxnID."""

    bodies = []
    for i, txn_id in enumerate(txn_ids):
        bodies.append(
            f'    <TxnDelRq requestID="{i}">\n'
            f"      <TxnDelType>{spec.del_type}</TxnDelType>\n"
            f"      <TxnID>{_escape(txn_id)}</TxnID>\n"
            f"    </TxnDelRq>"
        )
    return wrap("\n".join(bodies), on_error="continueOnError")


def build_del_request(spec: EntitySpec, ids: List[str]) -> str:
    return (
        build_list_del_request(spec, ids)
        if spec.kind == "list"
        else build_txn_del_request(spec, ids)
    )


class QBError(Exception):
    """Raised when a qbXML response reports a non-zero status code."""


def parse_responses(xml_text: str) -> List[Dict]:
    """Parse a qbXML response document into a list of per-request results.

    Each entry has ``request_id``, ``status_code`` (int), ``status_severity``,
    ``status_message`` and ``element`` (the ElementTree node of the *Rs, so the
    caller can pull out records for a query).
    """

    root = ET.fromstring(xml_text)
    msgs = root.find("QBXMLMsgsRs")
    if msgs is None:
        raise QBError("Malformed qbXML response: no QBXMLMsgsRs element")

    results = []
    for rs in list(msgs):
        results.append(
            {
                "request_id": rs.get("requestID"),
                "status_code": int(rs.get("statusCode", "0")),
                "status_severity": rs.get("statusSeverity", ""),
                "status_message": rs.get("statusMessage", ""),
                "element": rs,
                "tag": rs.tag,
            }
        )
    return results


def _element_to_record(node: ET.Element, prefix: str = "") -> Dict[str, str]:
    """Flatten a Ret aggregate into a dotted-key dict of leaf text values.

    Repeated children get an index suffix so the structure round-trips, e.g.
    ``InvoiceLineRet`` #1 becomes keys prefixed ``line1_``.
    """

    record: Dict[str, str] = {}
    counts: Dict[str, int] = {}
    for child in list(node):
        tag = child.tag
        has_children = len(list(child)) > 0
        if has_children:
            counts[tag] = counts.get(tag, 0) + 1
            # Give repeated line aggregates a friendly line{n}_ prefix.
            if tag.endswith("LineRet"):
                child_prefix = f"{prefix}line{counts[tag]}_"
            else:
                child_prefix = f"{prefix}{tag}."
            record.update(_element_to_record(child, child_prefix))
        else:
            record[f"{prefix}{tag}"] = child.text or ""
    return record


def extract_query_records(rs_element: ET.Element, spec: EntitySpec) -> List[Dict[str, str]]:
    """Extract flattened records from a query response aggregate."""

    records = []
    for ret in rs_element.findall(spec.ret_aggregate):
        records.append(_element_to_record(ret))
    return records
