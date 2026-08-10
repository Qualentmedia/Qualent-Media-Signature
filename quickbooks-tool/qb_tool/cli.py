"""Command-line interface for the QuickBooks Desktop import/export/delete tool."""

from __future__ import annotations

import argparse
import sys
from typing import List, Optional

from . import operations
from .config import load_config
from .connection import QuickBooksConnection, QuickBooksUnavailable
from .entities import entity_names, get_entity
from .records import read_records, write_records

PROG = "qb-tool"


def _add_connection_args(p: argparse.ArgumentParser) -> None:
    p.add_argument("--company-file", default=None,
                   help="Path to the .QBW company file (default: currently open file).")
    p.add_argument("--app-name", default=None,
                   help="Application name shown in QuickBooks Integrated Applications.")
    p.add_argument("--config", default="",
                   help="Path to a JSON config file (default: auto-discover qb.config.json).")
    p.add_argument("--dry-run", action="store_true",
                   help="Validate and build requests without contacting QuickBooks.")


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog=PROG,
        description="Automated Import / Export / Delete tool for QuickBooks Desktop (Windows).",
    )
    sub = parser.add_subparsers(dest="command", required=True)

    # import
    p_imp = sub.add_parser("import", help="Import (add) records from a CSV/JSON file.")
    p_imp.add_argument("entity", choices=entity_names(), help="Entity type to import.")
    p_imp.add_argument("file", help="Input CSV or JSON file.")
    p_imp.add_argument("--format", default="", choices=["", "csv", "json"],
                       help="Force input format (default: infer from extension).")
    _add_connection_args(p_imp)

    # export
    p_exp = sub.add_parser("export", help="Export (query) records to a CSV/JSON file.")
    p_exp.add_argument("entity", choices=entity_names(), help="Entity type to export.")
    p_exp.add_argument("file", help="Output CSV or JSON file.")
    p_exp.add_argument("--format", default="", choices=["", "csv", "json"],
                       help="Force output format (default: infer from extension).")
    p_exp.add_argument("--max", type=int, default=None,
                       help="Maximum number of records to return.")
    p_exp.add_argument("--status", default="All", choices=["All", "ActiveOnly", "InactiveOnly"],
                       help="Active status filter for list entities (default: All).")
    _add_connection_args(p_exp)

    # delete
    p_del = sub.add_parser("delete", help="Delete records by ID or from an exported file.")
    p_del.add_argument("entity", choices=entity_names(), help="Entity type to delete.")
    p_del.add_argument("--file", default="",
                       help="CSV/JSON file containing ListID/TxnID columns to delete.")
    p_del.add_argument("--id", dest="ids", action="append", default=[],
                       help="Explicit ListID/TxnID to delete (repeatable).")
    p_del.add_argument("--yes", "-y", action="store_true",
                       help="Skip the confirmation prompt.")
    _add_connection_args(p_del)

    # list-entities
    sub.add_parser("list-entities", help="List supported entity types and exit.")

    return parser


def _resolve_conn_kwargs(args) -> dict:
    cfg = load_config(getattr(args, "config", ""))
    app_name = args.app_name or cfg.get("app_name") or "Qualent QuickBooks Tool"
    company_file = args.company_file if args.company_file is not None else cfg.get("company_file", "")
    return {"app_name": app_name, "company_file": company_file}


def _print_result(result: operations.OpResult, verb: str) -> None:
    print(f"{verb}: {result.ok} succeeded, {result.failed} failed.")
    for err in result.errors:
        print(f"  ! {err}", file=sys.stderr)


def _run_import(args) -> int:
    spec = get_entity(args.entity)
    records = read_records(args.file, args.format)
    print(f"Read {len(records)} record(s) from {args.file}.")
    if args.dry_run:
        result = operations.import_records(None, spec, records, dry_run=True)  # type: ignore[arg-type]
        _print_result(result, "Import (dry-run)")
        return 0 if result.failed == 0 else 1
    with QuickBooksConnection(**_resolve_conn_kwargs(args)) as qb:
        result = operations.import_records(qb, spec, records)
    _print_result(result, "Import")
    return 0 if result.failed == 0 else 1


def _run_export(args) -> int:
    spec = get_entity(args.entity)
    if args.dry_run:
        print("Dry-run: export requires a live QuickBooks connection; nothing written.")
        return 0
    with QuickBooksConnection(**_resolve_conn_kwargs(args)) as qb:
        result = operations.export_records(qb, spec, max_returned=args.max, active_status=args.status)
    if result.failed:
        _print_result(result, "Export")
        return 1
    id_key = "ListID" if spec.kind == "list" else "TxnID"
    columns = [id_key] + (["EditSequence"] if spec.kind == "list" else []) + list(spec.export_columns)
    write_records(args.file, result.records, columns, args.format)
    print(f"Export: wrote {len(result.records)} record(s) to {args.file}.")
    return 0


def _run_delete(args) -> int:
    spec = get_entity(args.entity)
    records = read_records(args.file) if args.file else []
    ids = operations.collect_ids(spec, records, args.ids)
    if not ids:
        print("Nothing to delete: no IDs supplied via --id or --file.", file=sys.stderr)
        return 1

    id_kind = "ListID" if spec.kind == "list" else "TxnID"
    print(f"About to delete {len(ids)} {args.entity}(s) by {id_kind}.")
    if not args.yes and not args.dry_run:
        reply = input("This cannot be undone. Type 'yes' to continue: ").strip().lower()
        if reply != "yes":
            print("Aborted.")
            return 1

    if args.dry_run:
        result = operations.delete_records(None, spec, ids, dry_run=True)  # type: ignore[arg-type]
        _print_result(result, "Delete (dry-run)")
        return 0
    with QuickBooksConnection(**_resolve_conn_kwargs(args)) as qb:
        result = operations.delete_records(qb, spec, ids)
    _print_result(result, "Delete")
    return 0 if result.failed == 0 else 1


def main(argv: Optional[List[str]] = None) -> int:
    args = build_parser().parse_args(argv)

    if args.command == "list-entities":
        for name in entity_names():
            spec = get_entity(name)
            print(f"  {name:10s} ({spec.kind})")
        return 0

    try:
        if args.command == "import":
            return _run_import(args)
        if args.command == "export":
            return _run_export(args)
        if args.command == "delete":
            return _run_delete(args)
    except QuickBooksUnavailable as exc:
        print(f"QuickBooks error: {exc}", file=sys.stderr)
        return 2
    except (FileNotFoundError, ValueError, KeyError) as exc:
        print(f"Error: {exc}", file=sys.stderr)
        return 2

    return 0


if __name__ == "__main__":  # pragma: no cover
    raise SystemExit(main())
