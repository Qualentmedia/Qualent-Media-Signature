"""Entity definitions for the QuickBooks Desktop automation tool.

Each supported QuickBooks object is described here in a single place: whether it
is a *list* entity (Customer, Vendor, Item) or a *transaction* entity (Invoice,
Bill), which qbXML requests drive it, and how flat CSV/JSON records map onto
qbXML fields.

Keeping this metadata declarative lets the importer, exporter and deleter share
one source of truth and makes adding a new entity a matter of adding a row here.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Callable, Dict, List, Optional


@dataclass(frozen=True)
class FieldSpec:
    """Maps a flat record column onto a qbXML element path.

    ``path`` is a dot-separated element path relative to the entity's Add
    aggregate, e.g. ``"BillAddress.Addr1"``. ``required`` fields cause an import
    row to be rejected before it is ever sent to QuickBooks.
    """

    column: str
    path: str
    required: bool = False


@dataclass(frozen=True)
class EntitySpec:
    name: str
    kind: str  # "list" or "txn"
    add_request: str  # e.g. "CustomerAddRq"
    query_request: str  # e.g. "CustomerQueryRq"
    add_aggregate: str  # e.g. "CustomerAdd"
    ret_aggregate: str  # e.g. "CustomerRet"
    del_type: str  # ListDelType or TxnDelType value, e.g. "Customer" / "Invoice"
    fields: List[FieldSpec]
    # Columns exported by default (in order). ListID/EditSequence or TxnID are
    # always included on top of these so exported files round-trip for deletes.
    export_columns: List[str]
    line_item: Optional["LineItemSpec"] = None


@dataclass(frozen=True)
class LineItemSpec:
    """Describes repeating line items for transaction entities."""

    add_aggregate: str  # e.g. "InvoiceLineAdd"
    ret_aggregate: str  # e.g. "InvoiceLineRet"
    # Prefix used in flat records for line columns, e.g. "line" -> line1_item.
    prefix: str
    fields: List[FieldSpec]


# --- List entities ---------------------------------------------------------

CUSTOMER = EntitySpec(
    name="customer",
    kind="list",
    add_request="CustomerAddRq",
    query_request="CustomerQueryRq",
    add_aggregate="CustomerAdd",
    ret_aggregate="CustomerRet",
    del_type="Customer",
    fields=[
        FieldSpec("name", "Name", required=True),
        FieldSpec("company", "CompanyName"),
        FieldSpec("first_name", "FirstName"),
        FieldSpec("last_name", "LastName"),
        FieldSpec("phone", "Phone"),
        FieldSpec("email", "Email"),
        FieldSpec("addr1", "BillAddress.Addr1"),
        FieldSpec("city", "BillAddress.City"),
        FieldSpec("state", "BillAddress.State"),
        FieldSpec("postal_code", "BillAddress.PostalCode"),
        FieldSpec("country", "BillAddress.Country"),
    ],
    export_columns=[
        "name", "company", "first_name", "last_name", "phone", "email",
        "addr1", "city", "state", "postal_code", "country",
    ],
)

VENDOR = EntitySpec(
    name="vendor",
    kind="list",
    add_request="VendorAddRq",
    query_request="VendorQueryRq",
    add_aggregate="VendorAdd",
    ret_aggregate="VendorRet",
    del_type="Vendor",
    fields=[
        FieldSpec("name", "Name", required=True),
        FieldSpec("company", "CompanyName"),
        FieldSpec("first_name", "FirstName"),
        FieldSpec("last_name", "LastName"),
        FieldSpec("phone", "Phone"),
        FieldSpec("email", "Email"),
        FieldSpec("account_number", "AccountNumber"),
        FieldSpec("addr1", "VendorAddress.Addr1"),
        FieldSpec("city", "VendorAddress.City"),
        FieldSpec("state", "VendorAddress.State"),
        FieldSpec("postal_code", "VendorAddress.PostalCode"),
    ],
    export_columns=[
        "name", "company", "first_name", "last_name", "phone", "email",
        "account_number", "addr1", "city", "state", "postal_code",
    ],
)

ITEM_SERVICE = EntitySpec(
    name="item",
    kind="list",
    add_request="ItemServiceAddRq",
    query_request="ItemQueryRq",
    add_aggregate="ItemServiceAdd",
    ret_aggregate="ItemServiceRet",
    del_type="ItemService",
    fields=[
        FieldSpec("name", "Name", required=True),
        FieldSpec("description", "SalesOrPurchase.Desc"),
        FieldSpec("price", "SalesOrPurchase.Price"),
        FieldSpec("account", "SalesOrPurchase.AccountRef.FullName", required=True),
    ],
    export_columns=["name", "description", "price", "account"],
)

# --- Transaction entities --------------------------------------------------

INVOICE = EntitySpec(
    name="invoice",
    kind="txn",
    add_request="InvoiceAddRq",
    query_request="InvoiceQueryRq",
    add_aggregate="InvoiceAdd",
    ret_aggregate="InvoiceRet",
    del_type="Invoice",
    fields=[
        FieldSpec("customer", "CustomerRef.FullName", required=True),
        FieldSpec("txn_date", "TxnDate"),
        FieldSpec("ref_number", "RefNumber"),
        FieldSpec("po_number", "PONumber"),
        FieldSpec("terms", "TermsRef.FullName"),
        FieldSpec("memo", "Memo"),
    ],
    export_columns=["customer", "txn_date", "ref_number", "po_number", "memo"],
    line_item=LineItemSpec(
        add_aggregate="InvoiceLineAdd",
        ret_aggregate="InvoiceLineRet",
        prefix="line",
        fields=[
            FieldSpec("item", "ItemRef.FullName"),
            FieldSpec("desc", "Desc"),
            FieldSpec("quantity", "Quantity"),
            FieldSpec("rate", "Rate"),
            FieldSpec("amount", "Amount"),
        ],
    ),
)

BILL = EntitySpec(
    name="bill",
    kind="txn",
    add_request="BillAddRq",
    query_request="BillQueryRq",
    add_aggregate="BillAdd",
    ret_aggregate="BillRet",
    del_type="Bill",
    fields=[
        FieldSpec("vendor", "VendorRef.FullName", required=True),
        FieldSpec("txn_date", "TxnDate"),
        FieldSpec("ref_number", "RefNumber"),
        FieldSpec("due_date", "DueDate"),
        FieldSpec("terms", "TermsRef.FullName"),
        FieldSpec("memo", "Memo"),
    ],
    export_columns=["vendor", "txn_date", "ref_number", "due_date", "memo"],
    line_item=LineItemSpec(
        add_aggregate="ExpenseLineAdd",
        ret_aggregate="ExpenseLineRet",
        prefix="line",
        fields=[
            FieldSpec("account", "AccountRef.FullName"),
            FieldSpec("amount", "Amount"),
            FieldSpec("memo", "Memo"),
        ],
    ),
)


ENTITIES: Dict[str, EntitySpec] = {
    e.name: e for e in (CUSTOMER, VENDOR, ITEM_SERVICE, INVOICE, BILL)
}


def get_entity(name: str) -> EntitySpec:
    key = name.strip().lower()
    if key not in ENTITIES:
        supported = ", ".join(sorted(ENTITIES))
        raise KeyError(f"Unknown entity '{name}'. Supported: {supported}")
    return ENTITIES[key]


def entity_names() -> List[str]:
    return sorted(ENTITIES)
