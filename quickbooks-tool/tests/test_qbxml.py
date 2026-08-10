"""Unit tests for qbXML building and parsing (run on any platform)."""

import os
import sys
import xml.etree.ElementTree as ET

import pytest

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from qb_tool import qbxml
from qb_tool.entities import CUSTOMER, INVOICE, get_entity


def _first_element(xml_text):
    return ET.fromstring(xml_text)


def test_build_add_customer_maps_nested_address():
    rec = {
        "name": "Acme Co",
        "company": "Acme",
        "email": "a@acme.test",
        "addr1": "1 Main St",
        "city": "Austin",
        "state": "TX",
    }
    body = qbxml.build_add(CUSTOMER, rec)
    root = _first_element(f"<root>{body}</root>")
    add = root.find("CustomerAddRq/CustomerAdd")
    assert add.findtext("Name") == "Acme Co"
    assert add.findtext("CompanyName") == "Acme"
    assert add.findtext("BillAddress/Addr1") == "1 Main St"
    assert add.findtext("BillAddress/City") == "Austin"


def test_build_add_requires_required_fields():
    with pytest.raises(ValueError) as exc:
        qbxml.build_add(CUSTOMER, {"company": "no name"})
    assert "name" in str(exc.value)


def test_build_add_escapes_special_characters():
    body = qbxml.build_add(CUSTOMER, {"name": "Tom & Jerry <LLC>"})
    assert "Tom &amp; Jerry &lt;LLC&gt;" in body
    # And it still parses as valid XML.
    _first_element(f"<root>{body}</root>")


def test_build_add_request_wraps_multiple_records():
    recs = [{"name": "A"}, {"name": "B"}]
    doc = qbxml.build_add_request(CUSTOMER, recs)
    root = ET.fromstring(doc)
    msgs = root.find("QBXMLMsgsRq")
    assert msgs.get("onError") == "continueOnError"
    assert len(msgs.findall("CustomerAddRq")) == 2


def test_invoice_flat_line_items():
    rec = {
        "customer": "Acme Co",
        "txn_date": "2026-07-14",
        "line1_item": "Consulting",
        "line1_rate": "150",
        "line1_quantity": "2",
        "line2_item": "Support",
        "line2_amount": "99",
    }
    body = qbxml.build_add(INVOICE, rec)
    root = _first_element(f"<root>{body}</root>")
    add = root.find("InvoiceAddRq/InvoiceAdd")
    lines = add.findall("InvoiceLineAdd")
    assert len(lines) == 2
    assert lines[0].findtext("ItemRef/FullName") == "Consulting"
    assert lines[0].findtext("Rate") == "150"
    assert lines[1].findtext("Amount") == "99"


def test_invoice_nested_line_items():
    rec = {
        "customer": "Acme Co",
        "lines": [
            {"item": "Widget", "quantity": "3", "rate": "10"},
        ],
    }
    body = qbxml.build_add(INVOICE, rec)
    root = _first_element(f"<root>{body}</root>")
    lines = root.findall("InvoiceAddRq/InvoiceAdd/InvoiceLineAdd")
    assert len(lines) == 1
    assert lines[0].findtext("ItemRef/FullName") == "Widget"


def test_build_query_request_list_has_active_status():
    doc = qbxml.build_query_request(CUSTOMER, max_returned=5, active_status="ActiveOnly")
    root = ET.fromstring(doc)
    q = root.find("QBXMLMsgsRq/CustomerQueryRq")
    assert q.findtext("ActiveStatus") == "ActiveOnly"
    assert q.findtext("MaxReturned") == "5"


def test_build_query_request_txn_has_no_active_status():
    doc = qbxml.build_query_request(INVOICE)
    root = ET.fromstring(doc)
    q = root.find("QBXMLMsgsRq/InvoiceQueryRq")
    assert q.find("ActiveStatus") is None


def test_list_del_vs_txn_del():
    list_doc = qbxml.build_del_request(CUSTOMER, ["80000001-123"])
    root = ET.fromstring(list_doc)
    assert root.findtext("QBXMLMsgsRq/ListDelRq/ListDelType") == "Customer"
    assert root.findtext("QBXMLMsgsRq/ListDelRq/ListID") == "80000001-123"

    txn_doc = qbxml.build_del_request(INVOICE, ["ABC-1"])
    root = ET.fromstring(txn_doc)
    assert root.findtext("QBXMLMsgsRq/TxnDelRq/TxnDelType") == "Invoice"
    assert root.findtext("QBXMLMsgsRq/TxnDelRq/TxnID") == "ABC-1"


def test_parse_responses_reads_status():
    xml_text = """<?xml version="1.0"?>
    <QBXML><QBXMLMsgsRs>
      <CustomerAddRs requestID="0" statusCode="0" statusSeverity="Info" statusMessage="OK"/>
      <CustomerAddRs requestID="1" statusCode="3100" statusSeverity="Error"
         statusMessage="Name already in use."/>
    </QBXMLMsgsRs></QBXML>"""
    responses = qbxml.parse_responses(xml_text)
    assert len(responses) == 2
    assert responses[0]["status_code"] == 0
    assert responses[1]["status_code"] == 3100
    assert "already in use" in responses[1]["status_message"]


def test_extract_query_records_flattens_and_indexes_lines():
    xml_text = """<?xml version="1.0"?>
    <QBXML><QBXMLMsgsRs>
      <InvoiceQueryRs requestID="0" statusCode="0" statusSeverity="Info">
        <InvoiceRet>
          <TxnID>ABC-1</TxnID>
          <RefNumber>1001</RefNumber>
          <CustomerRef><FullName>Acme Co</FullName></CustomerRef>
          <InvoiceLineRet><Desc>Consulting</Desc><Amount>300.00</Amount></InvoiceLineRet>
          <InvoiceLineRet><Desc>Support</Desc><Amount>99.00</Amount></InvoiceLineRet>
        </InvoiceRet>
      </InvoiceQueryRs>
    </QBXMLMsgsRs></QBXML>"""
    responses = qbxml.parse_responses(xml_text)
    records = qbxml.extract_query_records(responses[0]["element"], INVOICE)
    assert len(records) == 1
    rec = records[0]
    assert rec["TxnID"] == "ABC-1"
    assert rec["CustomerRef.FullName"] == "Acme Co"
    assert rec["line1_Desc"] == "Consulting"
    assert rec["line2_Amount"] == "99.00"


def test_get_entity_unknown_raises():
    with pytest.raises(KeyError):
        get_entity("nope")
