# QuickBooks Desktop — Automated Import / Export / Delete Tool (Windows)

A command-line tool for **Windows** that automates bulk **import**, **export**,
and **delete** operations against **QuickBooks Desktop** (Pro / Premier /
Enterprise). It talks to QuickBooks through Intuit's official
[qbXML SDK](https://developer.intuit.com/app/developer/qbdesktop/docs) via the
`QBXMLRP2.RequestProcessor` COM component — the same, supported integration
layer used by commercial QuickBooks add-ons. No third-party cloud service is
involved; your company data never leaves the machine.

> **Which QuickBooks?** This targets **QuickBooks *Desktop*** on Windows.
> QuickBooks *Online* uses a different (REST) API and is out of scope for this
> tool.

## What it does

| Command | Action |
| --- | --- |
| `import` | Read a CSV/JSON file and **add** records to QuickBooks. |
| `export` | **Query** QuickBooks and write records to a CSV/JSON file. |
| `delete` | **Delete** list objects or transactions by their QuickBooks ID. |
| `list-entities` | Show the supported entity types. |

Supported entities:

| Entity | Type | qbXML objects |
| --- | --- | --- |
| `customer` | list | `CustomerAdd` / `CustomerQuery` / `ListDel` |
| `vendor` | list | `VendorAdd` / `VendorQuery` / `ListDel` |
| `item` | list | `ItemServiceAdd` / `ItemQuery` / `ListDel` |
| `invoice` | txn | `InvoiceAdd` / `InvoiceQuery` / `TxnDel` |
| `bill` | txn | `BillAdd` / `BillQuery` / `TxnDel` |

## Requirements

- Windows 10/11 (or Windows Server).
- **QuickBooks Desktop** installed, *or* the free **QBXMLRP2 redistributable**
  from the QuickBooks SDK, for live operations.
- **Python 3.8+** on your `PATH`.
- The company file open in QuickBooks (single-user mode is simplest) and this
  application authorized under **Edit → Preferences → Integrated Applications**
  the first time you connect.

## Setup

```bat
:: from the quickbooks-tool folder
install.bat
```

`install.bat` creates a local virtual environment in `.venv` and installs
`pywin32`. Then run everything through the launcher:

```bat
qb-tool.bat --help
qb-tool.bat list-entities
```

You can optionally copy `qb.config.sample.json` to `qb.config.json` and set your
company file path so you don't have to pass `--company-file` every time.

## Usage

### Import

```bat
:: Add customers from a CSV
qb-tool.bat import customer samples\customers.csv

:: Add invoices from JSON (with line items)
qb-tool.bat import invoice samples\invoices.json

:: Validate a file without touching QuickBooks
qb-tool.bat import customer samples\customers.csv --dry-run
```

Records that fail local validation (e.g. missing a required `name`) are reported
and skipped; the rest are still submitted. Server-side errors from QuickBooks
(such as a duplicate name) are reported per row.

### Export

```bat
:: Export all customers to CSV (includes ListID + EditSequence for later edits/deletes)
qb-tool.bat export customer out\customers.csv

:: Export the 500 most recent invoices to JSON
qb-tool.bat export invoice out\invoices.json --max 500

:: Only active items
qb-tool.bat export item out\items.csv --status ActiveOnly
```

Exported files include each record's `ListID` (list entities) or `TxnID`
(transactions), so an export can be fed straight back into `delete`.

### Delete

```bat
:: Delete everything listed in an exported file (asks for confirmation)
qb-tool.bat delete invoice --file out\invoices.csv

:: Delete specific records by ID, no prompt
qb-tool.bat delete customer --id 80000012-1699999999 --id 80000013-1699999999 --yes

:: See what would be deleted without doing it
qb-tool.bat delete invoice --file out\invoices.csv --dry-run
```

> **Deletes are permanent.** The command prompts for confirmation unless you
> pass `--yes`. List objects (customers, vendors, items) can only be deleted
> when no transactions reference them — QuickBooks returns an error otherwise,
> which the tool reports per row. To pull a name that *is* referenced out of
> circulation, export it, mark it inactive in QuickBooks instead.

## File formats

Both CSV and JSON are accepted (auto-detected by extension, override with
`--format`).

**Customers (CSV)** — columns: `name` (required), `company`, `first_name`,
`last_name`, `phone`, `email`, `addr1`, `city`, `state`, `postal_code`,
`country`. See `samples/customers.csv`.

**Invoices (JSON)** — each invoice has header fields plus a `lines` array:

```json
{
  "customer": "Acme Corporation",
  "txn_date": "2026-07-14",
  "ref_number": "1001",
  "lines": [
    { "item": "Consulting", "quantity": "8", "rate": "175" }
  ]
}
```

**Invoices (CSV)** — line items are flattened as `line1_item`, `line1_rate`,
`line1_quantity`, `line2_item`, … See `samples/invoices.csv`.

Run `qb-tool.bat list-entities` and read `qb_tool/entities.py` for the full,
authoritative field list of every entity.

## How it works

```
CSV / JSON  ──►  entities.py (field map)  ──►  qbxml.py (build request)
                                                     │
                                                     ▼
                                        QBXMLRP2.RequestProcessor (COM)
                                                     │
                                                     ▼
                                              QuickBooks Desktop
                                                     │
CSV / JSON  ◄──  qbxml.py (parse response)  ◄────────┘
```

- `qb_tool/entities.py` — declarative field maps for each entity (one place to
  add fields or new entity types).
- `qb_tool/qbxml.py` — pure-Python qbXML request builders and response parser
  (no Windows dependency; fully unit-tested).
- `qb_tool/connection.py` — the Windows-only COM session wrapper.
- `qb_tool/operations.py` — import/export/delete orchestration.
- `qb_tool/cli.py` — argument parsing and the user-facing commands.

## Development / tests

The core logic (request building, response parsing, file I/O, orchestration) is
covered by tests that run on **any** platform — no Windows or QuickBooks needed:

```bash
pip install pytest
python -m pytest tests/ -q
```

Only `connection.py` requires Windows + the QuickBooks SDK at runtime.

## Safety notes

- **Back up your company file** before bulk imports or deletes.
- Try new files with `--dry-run` first.
- Run against a **QuickBooks sample company** before touching production data.
- Imports and deletes use `continueOnError`, so one bad row won't abort the
  batch — always read the per-row summary the tool prints.
