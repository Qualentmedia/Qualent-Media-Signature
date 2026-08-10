"""High-level import / export / delete operations against QuickBooks Desktop.

These functions orchestrate: build qbXML → send over the connection → parse the
response into a friendly summary. The connection object only needs a
``process(request_xml) -> response_xml`` method, which keeps these functions
testable with a fake connection.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Dict, List, Optional, Protocol

from . import qbxml
from .entities import EntitySpec


class SupportsProcess(Protocol):
    def process(self, request_xml: str) -> str: ...


@dataclass
class OpResult:
    ok: int = 0
    failed: int = 0
    records: List[Dict] = field(default_factory=list)
    errors: List[str] = field(default_factory=list)

    @property
    def total(self) -> int:
        return self.ok + self.failed


def import_records(conn: SupportsProcess, spec: EntitySpec, records: List[Dict],
                   dry_run: bool = False) -> OpResult:
    """Add ``records`` to QuickBooks. Skips records failing local validation."""

    result = OpResult()

    valid: List[Dict] = []
    for idx, rec in enumerate(records):
        try:
            qbxml.build_add(spec, rec)  # validates required fields
        except ValueError as exc:
            result.failed += 1
            result.errors.append(f"row {idx + 1}: {exc}")
            continue
        valid.append(rec)

    if not valid:
        return result
    if dry_run:
        result.ok = len(valid)
        return result

    request = qbxml.build_add_request(spec, valid)
    response = conn.process(request)
    for resp in qbxml.parse_responses(response):
        if resp["status_code"] == 0:
            result.ok += 1
        else:
            result.failed += 1
            result.errors.append(
                f"request {resp['request_id']}: "
                f"[{resp['status_code']}] {resp['status_message']}"
            )
    return result


def export_records(conn: SupportsProcess, spec: EntitySpec,
                   max_returned: Optional[int] = None,
                   active_status: str = "All") -> OpResult:
    """Query QuickBooks and return flattened records (incl. ListID/TxnID)."""

    result = OpResult()
    request = qbxml.build_query_request(
        spec, max_returned=max_returned, active_status=active_status
    )
    response = conn.process(request)
    for resp in qbxml.parse_responses(response):
        # statusCode 1 == "no matching records", which is a success with 0 rows.
        if resp["status_code"] not in (0, 1):
            result.failed += 1
            result.errors.append(
                f"[{resp['status_code']}] {resp['status_message']}"
            )
            continue
        result.records = qbxml.extract_query_records(resp["element"], spec)
        result.ok = len(result.records)
    return result


def _id_key(spec: EntitySpec) -> str:
    return "ListID" if spec.kind == "list" else "TxnID"


def collect_ids(spec: EntitySpec, records: List[Dict], explicit_ids: List[str]) -> List[str]:
    """Resolve the set of IDs to delete from explicit IDs and/or record files."""

    key = _id_key(spec)
    ids: List[str] = list(explicit_ids)
    for rec in records:
        value = rec.get(key) or rec.get(key.lower())
        if value:
            ids.append(str(value))
    # De-dupe while preserving order.
    seen = set()
    unique = []
    for i in ids:
        if i not in seen:
            seen.add(i)
            unique.append(i)
    return unique


def delete_records(conn: SupportsProcess, spec: EntitySpec, ids: List[str],
                   dry_run: bool = False) -> OpResult:
    """Delete list objects or transactions by their QuickBooks IDs."""

    result = OpResult()
    if not ids:
        return result
    if dry_run:
        result.ok = len(ids)
        return result

    request = qbxml.build_del_request(spec, ids)
    response = conn.process(request)
    for resp in qbxml.parse_responses(response):
        if resp["status_code"] == 0:
            result.ok += 1
        else:
            result.failed += 1
            result.errors.append(
                f"request {resp['request_id']}: "
                f"[{resp['status_code']}] {resp['status_message']}"
            )
    return result
