@echo off
REM ===========================================================================
REM  install.bat - One-time setup for the QuickBooks Import/Export/Delete tool.
REM  Creates a local virtual environment and installs dependencies.
REM  Requires: Python 3.8+ on PATH, and QuickBooks Desktop (or the QBXMLRP2
REM  redistributable) installed for live operations.
REM ===========================================================================
setlocal
cd /d "%~dp0"

where python >nul 2>nul
if errorlevel 1 (
    echo [ERROR] Python was not found on your PATH.
    echo         Install Python 3.8+ from https://www.python.org/downloads/windows/
    echo         and be sure to check "Add Python to PATH" during setup.
    exit /b 1
)

echo Creating virtual environment in .venv ...
python -m venv .venv
if errorlevel 1 (
    echo [ERROR] Failed to create the virtual environment.
    exit /b 1
)

echo Installing dependencies ...
call ".venv\Scripts\python.exe" -m pip install --upgrade pip
call ".venv\Scripts\python.exe" -m pip install -r requirements.txt
if errorlevel 1 (
    echo [ERROR] Dependency installation failed.
    exit /b 1
)

echo.
echo Setup complete. Run the tool with:  qb-tool.bat --help
endlocal
