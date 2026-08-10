"""Tests for CSV/JSON record reading and writing round-trips."""

import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from qb_tool.records import read_records, write_records


def test_csv_round_trip(tmp_path):
    path = tmp_path / "customers.csv"
    records = [
        {"name": "Acme", "email": "a@acme.test"},
        {"name": "Beta", "email": "b@beta.test"},
    ]
    write_records(str(path), records, ["name", "email"])
    loaded = read_records(str(path))
    assert loaded == records


def test_json_round_trip(tmp_path):
    path = tmp_path / "invoices.json"
    records = [{"customer": "Acme", "lines": [{"item": "X", "rate": "10"}]}]
    write_records(str(path), records, ["customer"])
    loaded = read_records(str(path))
    assert loaded == records


def test_json_envelope_is_unwrapped(tmp_path):
    path = tmp_path / "wrapped.json"
    path.write_text(json.dumps({"records": [{"name": "A"}]}), encoding="utf-8")
    loaded = read_records(str(path))
    assert loaded == [{"name": "A"}]


def test_write_preserves_column_order_and_extras(tmp_path):
    path = tmp_path / "out.csv"
    records = [{"ListID": "1", "name": "Acme", "extra": "z"}]
    write_records(str(path), records, ["ListID", "name"])
    header = path.read_text(encoding="utf-8").splitlines()[0]
    assert header.startswith("ListID,name")
    assert "extra" in header


def test_format_override(tmp_path):
    path = tmp_path / "data.txt"
    records = [{"name": "Acme"}]
    write_records(str(path), records, ["name"], fmt="json")
    loaded = read_records(str(path), fmt="json")
    assert loaded == records
