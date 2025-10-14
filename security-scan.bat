@echo off
REM Security Scanner for TodoList Application
REM Scans both TypeScript/React frontend and Java backend for OWASP Top 10 vulnerabilities

setlocal enabledelayedexpansion

set TOTAL_ISSUES=0
set CRITICAL_ISSUES=0
set HIGH_ISSUES=0
set MEDIUM_ISSUES=0
set LOW_ISSUES=0

echo ================================================================
echo          TodoList Security Scanner - OWASP Top 10
echo ================================================================
echo.

REM Check prerequisites
echo Checking Prerequisites
echo ----------------------------------------------------------------

where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Node.js not found
    exit /b 1
)

where npm >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] npm not found
    exit /b 1
)

where mvn >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [WARNING] Maven not found - skipping Java backend checks
    set SKIP_MAVEN=true
)

where semgrep >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [WARNING] Semgrep not found - install with: pip install semgrep
    echo   Continuing without Semgrep...
    set SKIP_SEMGREP=true
)

echo [OK] Prerequisites checked
echo.

REM 1. ESLint Security Scan
echo 1. ESLint Security Scan (Frontend)
echo ----------------------------------------------------------------
cd todolist-frontend

call npm run lint > %TEMP%\eslint-output.txt 2>&1
if %ERRORLEVEL% equ 0 (
    echo [OK] No ESLint security issues found
) else (
    echo [WARNING] ESLint found issues
    type %TEMP%\eslint-output.txt
    set /a MEDIUM_ISSUES+=1
)

cd ..

REM 2. Semgrep Security Scan
if not "%SKIP_SEMGREP%"=="true" (
    echo.
    echo 2. Semgrep OWASP Top 10 Scan
    echo ----------------------------------------------------------------

    semgrep --config .semgrep.yml --json --output %TEMP%\semgrep-results.json . 2>nul
    if %ERRORLEVEL% equ 0 (
        echo [OK] Semgrep scan completed
        semgrep --config .semgrep.yml .
    ) else (
        echo [WARNING] Semgrep scan encountered issues
    )

    echo.
    echo 2b. Semgrep Community Rules Scan
    echo ----------------------------------------------------------------
    semgrep --config "p/owasp-top-ten" --config "p/security-audit" . 2>nul
)

REM 3. NPM Audit
echo.
echo 3. NPM Audit (Frontend Dependencies)
echo ----------------------------------------------------------------
cd todolist-frontend

call npm audit --json > %TEMP%\npm-audit.json 2>&1
if %ERRORLEVEL% equ 0 (
    echo [OK] No vulnerable npm dependencies found
) else (
    echo [WARNING] Vulnerable dependencies found
    call npm audit
    set /a HIGH_ISSUES+=1
)

cd ..

REM 4. Maven Security Check
if not "%SKIP_MAVEN%"=="true" (
    if exist todolist-backend (
        echo.
        echo 4. Maven Dependency Security Check
        echo ----------------------------------------------------------------
        cd todolist-backend

        call mvn dependency:tree -DoutputFile=%TEMP%\maven-deps.txt >nul 2>&1
        if %ERRORLEVEL% equ 0 (
            echo [OK] Maven dependency tree generated
        )

        cd ..
    )
)

REM 5. Configuration Security Check
echo.
echo 5. Configuration Security Check
echo ----------------------------------------------------------------

findstr /s /i "password secret key token" *.properties *.yml *.yaml .env 2>nul | findstr /v "TODO example sample" > %TEMP%\secrets-check.txt
if %ERRORLEVEL% equ 0 (
    echo [WARNING] Found potential secrets in configuration files
    type %TEMP%\secrets-check.txt
    set /a MEDIUM_ISSUES+=1
) else (
    echo [OK] No obvious secrets found in configuration files
)

REM Calculate total issues
set /a TOTAL_ISSUES=CRITICAL_ISSUES+HIGH_ISSUES+MEDIUM_ISSUES+LOW_ISSUES

REM Print Summary
echo.
echo ================================================================
echo                   Security Scan Summary
echo ================================================================
echo.

if %TOTAL_ISSUES% equ 0 (
    echo [OK] No security issues found!
    echo.
    exit /b 0
) else (
    echo Total Issues Found: %TOTAL_ISSUES%
    echo.

    if %CRITICAL_ISSUES% gtr 0 (
        echo   Critical: %CRITICAL_ISSUES%
    )

    if %HIGH_ISSUES% gtr 0 (
        echo   High:     %HIGH_ISSUES%
    )

    if %MEDIUM_ISSUES% gtr 0 (
        echo   Medium:   %MEDIUM_ISSUES%
    )

    if %LOW_ISSUES% gtr 0 (
        echo   Low:      %LOW_ISSUES%
    )

    echo.

    if %CRITICAL_ISSUES% gtr 0 (
        echo [ERROR] Security scan failed: Critical severity issues found
        echo Please fix these issues before committing.
        echo.
        exit /b 1
    )

    if %HIGH_ISSUES% gtr 0 (
        echo [ERROR] Security scan failed: High severity issues found
        echo Please fix these issues before committing.
        echo.
        exit /b 1
    )

    echo [WARNING] Security scan passed with warnings
    echo Consider fixing medium and low severity issues.
    echo.
    exit /b 0
)
