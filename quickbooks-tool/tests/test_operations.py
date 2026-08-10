"""Tests for import/export/delete orchestration using a fake connection."""

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from qb_tool import operations, qbxml
from qb_tool.entities import CUSTOMER, INVOICE


class FakeQB:
    """Records the last request and returns a canned response document."""

    def __init__(self, response):
        self.response = response
        self.last_request = None

    def process(self, request_xml):
        self.last_request = request_xml
        return self.response


def _add_response(*status_codes):
    rows = "".join(
        f'<CustomerAddRs requestID="{i}" statusCode="{c}" '
        f'statusSeverity="{"Info" if c == 0 else "Error"}" '
        f'statusMessage="{"OK" if c == 0 else "boom"}"/>'
        for i, c in enumerate(status_codes)
    )
    return f'<?xml version="1.0"?><QBXML><QBXMLMsgsRs>{rows}</QBXMLMsgsRs></QBXML>'


def test_import_skips_invalid_records_before_sending():
    qb = FakeQB(_add_response(0))  # only one valid record will be sent
    records = [{"name": "Good"}, {"company": "no name"}]
    result = operations.import_records(qb, CUSTOMER, records)
    assert result.ok == 1
    assert result.failed == 1
    assert any("missing required" in e for e in result.errors)
    # Only the valid record made it into the request.
    assert qb.last_request.count("<CustomerAdd>") == 1


def test_import_reports_server_side_errors():
    qb = FakeQB(_add_response(0, 3100))
    records = [{"name": "A"}, {"name": "B"}]
    result = operations.import_records(qb, CUSTOMER, records)
    assert result.ok == 1
    assert result.failed == 1


def test_import_dry_run_does_not_call_process():
    result = operations.import_records(None, CUSTOMER, [{"name": "A"}], dry_run=True)
    assert result.ok == 1
    assert result.failed == 0


def test_export_returns_flattened_records():
    xml_text = """<?xml version="1.0"?><QBXML><QBXMLMsgsRs>
      <CustomerQueryRs requestID="0" statusCode="0" statusSeverity="Info">
        <CustomerRet><ListID>80000001</ListID><Name>Acme</Name></CustomerRet>
        <CustomerRet><ListID>80000002</ListID><Name>Beta</Name></CustomerRet>
      </CustomerQueryRs></QBXMLMsgsRs></QBXML>"""
    qb = FakeQB(xml_text)
    result = operations.export_records(qb, CUSTOMER)
    assert result.ok == 2
    assert result.records[0]["ListID"] == "80000001"
    assert result.records[1]["Name"] == "Beta"


def test_export_treats_no_matches_as_success():
    xml_text = ('<?xml version="1.0"?><QBXML><QBXMLMsgsRs>'
                '<CustomerQueryRs requestID="0" statusCode="1" '
                'statusSeverity="Info" statusMessage="not found"/>'
                '</QBXMLMsgsRs></QBXML>')
    qb = FakeQB(xml_text)
    result = operations.export_records(qb, CUSTOMER)
    assert result.failed == 0
    assert result.ok == 0
    assert result.records == []


def test_collect_ids_merges_and_dedupes():
    records = [{"ListID": "1"}, {"ListID": "2"}, {"ListID": "1"}]
    ids = operations.collect_ids(CUSTOMER, records, ["3", "2"])
    assert ids == ["3", "2", "1"]


def test_collect_ids_uses_txnid_for_transactions():
    records = [{"TxnID": "T1"}, {"TxnID": "T2"}]
    ids = operations.collect_ids(INVOICE, records, [])
    assert ids == ["T1", "T2"]


def test_delete_builds_correct_request_and_counts():
    resp = ('<?xml version="1.0"?><QBXML><QBXMLMsgsRs>'
            '<ListDelRs requestID="0" statusCode="0" statusSeverity="Info"/>'
            '<ListDelRs requestID="1" statusCode="3200" statusSeverity="Error" '
            'statusMessage="in use"/>'
            '</QBXMLMsgsRs></QBXML>')
    qb = FakeQB(resp)
    result = operations.delete_records(qb, CUSTOMER, ["80000001", "80000002"])
    assert result.ok == 1
    assert result.failed == 1
    assert "<ListDelType>Customer</ListDelType>" in qb.last_request


def test_delete_dry_run_counts_without_calling():
    result = operations.delete_records(None, INVOICE, ["T1", "T2"], dry_run=True)
    assert result.ok == 2
