@echo off
REM ===========================================================================
REM  qb-tool.bat - Launcher for the QuickBooks Import/Export/Delete tool.
REM  Uses the local .venv created by install.bat when present, otherwise falls
REM  back to the system "python". All arguments are passed straight through.
REM
REM  Examples:
REM    qb-tool.bat list-entities
REM    qb-tool.bat import customer samples\customers.csv
REM    qb-tool.bat export invoice out\invoices.csv --max 500
REM    qb-tool.bat delete invoice --file out\invoices.csv
REM ===========================================================================
setlocal
cd /d "%~dp0"

if exist ".venv\Scripts\python.exe" (
    set "PY=.venv\Scripts\python.exe"
) else (
    set "PY=python"
)

"%PY%" -m qb_tool %*
exit /b %errorlevel%
