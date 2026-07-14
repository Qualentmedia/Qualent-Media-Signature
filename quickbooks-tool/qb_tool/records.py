"""Reading and writing record files (CSV and JSON) for import/export."""

from __future__ import annotations

import csv
import json
import os
from typing import Dict, List


def _detect_format(path: str, explicit: str = "") -> str:
    if explicit:
        return explicit.lower()
    ext = os.path.splitext(path)[1].lower()
    if ext == ".json":
        return "json"
    return "csv"


def read_records(path: str, fmt: str = "") -> List[Dict]:
    """Read a list of flat record dicts from a CSV or JSON file."""

    fmt = _detect_format(path, fmt)
    if fmt == "json":
        with open(path, "r", encoding="utf-8-sig") as fh:
            data = json.load(fh)
        if isinstance(data, dict):
            # Allow {"records": [...]} envelope as well as a bare list.
            data = data.get("records", [data])
        if not isinstance(data, list):
            raise ValueError(f"{path}: JSON must be a list of records")
        return data

    with open(path, "r", encoding="utf-8-sig", newline="") as fh:
        reader = csv.DictReader(fh)
        return [dict(row) for row in reader]


def write_records(path: str, records: List[Dict], columns: List[str], fmt: str = "") -> None:
    """Write records to CSV or JSON, keeping ``columns`` first and in order."""

    fmt = _detect_format(path, fmt)
    if fmt == "json":
        with open(path, "w", encoding="utf-8") as fh:
            json.dump(records, fh, indent=2, ensure_ascii=False)
        return

    # Union of the requested columns (first, in order) and any extra keys seen.
    ordered: List[str] = list(columns)
    seen = set(ordered)
    for rec in records:
        for key in rec:
            if key not in seen:
                seen.add(key)
                ordered.append(key)

    with open(path, "w", encoding="utf-8", newline="") as fh:
        writer = csv.DictWriter(fh, fieldnames=ordered, extrasaction="ignore")
        writer.writeheader()
        for rec in records:
            writer.writerow(rec)
