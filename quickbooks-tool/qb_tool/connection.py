"""Windows COM connection to QuickBooks Desktop via the qbXML request processor.

Talks to the ``QBXMLRP2.RequestProcessor`` COM object that ships with the free
QuickBooks SDK / QBXMLRP2 redistributable. This module is the only part of the
tool that requires Windows; import of ``pywin32`` is deferred so the rest of the
package (and its tests) run anywhere.

SDK reference: https://developer.intuit.com/app/developer/qbdesktop/docs/develop
"""

from __future__ import annotations

from typing import Optional

# QBXMLRP2 open-mode constants (from the QuickBooks SDK type library).
QB_DONT_CARE = 0  # qbFileOpenDoNotCare — attach to whatever file is open, else prompt
QB_SINGLE_USER = 1
QB_MULTI_USER = 2


class QuickBooksUnavailable(RuntimeError):
    """Raised when the QuickBooks SDK / COM processor cannot be reached."""


class QuickBooksConnection:
    """Context manager wrapping OpenConnection2 → BeginSession → EndSession.

    Usage::

        with QuickBooksConnection(app_name="QB Tool") as qb:
            response_xml = qb.process(request_xml)
    """

    def __init__(
        self,
        app_name: str = "Qualent QuickBooks Tool",
        company_file: str = "",
        open_mode: int = QB_DONT_CARE,
    ) -> None:
        self.app_name = app_name
        self.company_file = company_file
        self.open_mode = open_mode
        self._rp = None
        self._ticket: Optional[str] = None
        self._connection_open = False

    def open(self) -> "QuickBooksConnection":
        try:
            import pythoncom  # type: ignore
            import win32com.client  # type: ignore
        except ImportError as exc:  # pragma: no cover - Windows-only path
            raise QuickBooksUnavailable(
                "pywin32 is required to talk to QuickBooks Desktop. "
                "Install it with 'pip install pywin32' on Windows."
            ) from exc

        try:
            pythoncom.CoInitialize()
            self._rp = win32com.client.Dispatch("QBXMLRP2.RequestProcessor")
        except Exception as exc:  # pragma: no cover - Windows-only path
            raise QuickBooksUnavailable(
                "Could not create the QBXMLRP2.RequestProcessor COM object. "
                "Ensure QuickBooks Desktop (or the QBXMLRP2 redistributable) is "
                "installed on this machine."
            ) from exc

        try:
            self._rp.OpenConnection2("", self.app_name, 1)  # 1 = localQBD
            self._connection_open = True
            self._ticket = self._rp.BeginSession(self.company_file, self.open_mode)
        except Exception as exc:  # pragma: no cover - Windows-only path
            self.close()
            raise QuickBooksUnavailable(
                "Could not begin a QuickBooks session. Make sure QuickBooks is "
                "running with a company file open, and that this application is "
                "authorized (QuickBooks > Edit > Preferences > Integrated "
                "Applications)."
            ) from exc
        return self

    def process(self, request_xml: str) -> str:
        if not self._ticket:
            raise QuickBooksUnavailable("No active QuickBooks session.")
        return self._rp.ProcessRequest(self._ticket, request_xml)

    def close(self) -> None:
        try:
            if self._ticket is not None and self._rp is not None:
                self._rp.EndSession(self._ticket)
        except Exception:  # pragma: no cover - best-effort teardown
            pass
        finally:
            self._ticket = None
        try:
            if self._connection_open and self._rp is not None:
                self._rp.CloseConnection()
        except Exception:  # pragma: no cover - best-effort teardown
            pass
        finally:
            self._connection_open = False
            self._rp = None
            try:
                import pythoncom  # type: ignore

                pythoncom.CoUninitialize()
            except Exception:  # pragma: no cover
                pass

    def __enter__(self) -> "QuickBooksConnection":
        return self.open()

    def __exit__(self, exc_type, exc, tb) -> None:
        self.close()
