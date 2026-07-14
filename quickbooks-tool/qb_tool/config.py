"""Optional JSON configuration for connection defaults.

A config file lets users avoid repeating ``--company-file`` / ``--app-name`` on
every invocation. CLI flags always override config values. Example ``qb.config.json``::

    {
      "app_name": "Qualent QuickBooks Tool",
      "company_file": "C:\\\\Users\\\\Public\\\\Documents\\\\Company.QBW"
    }
"""

from __future__ import annotations

import json
import os
from typing import Dict

DEFAULT_CONFIG_NAMES = ("qb.config.json", "qb_tool.config.json")


def load_config(path: str = "") -> Dict:
    """Load config from ``path``, or auto-discover a default file in cwd."""

    candidates = [path] if path else list(DEFAULT_CONFIG_NAMES)
    for candidate in candidates:
        if candidate and os.path.isfile(candidate):
            with open(candidate, "r", encoding="utf-8-sig") as fh:
                return json.load(fh)
    if path:
        raise FileNotFoundError(f"Config file not found: {path}")
    return {}
