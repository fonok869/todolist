@echo off
REM Build script for VM deployment on Windows
REM Usage: build-for-vm.bat [backend_url] [mode]
REM Example: build-for-vm.bat http://192.168.1.100:8080 production

setlocal enabledelayedexpansion

set "BACKEND_URL=%~1"
set "MODE=%~2"

if "%BACKEND_URL%"=="" set "BACKEND_URL=http://localhost:8080"
if "%MODE%"=="" set "MODE=production"

echo Building TodoList Frontend for VM deployment...
echo Backend URL: %BACKEND_URL%
echo Mode: %MODE%

REM Set environment variable for build
set VITE_API_BASE_URL=%BACKEND_URL%

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo Failed to install dependencies
        exit /b 1
    )
)

REM Run linting
echo Running linting...
call npm run lint
if errorlevel 1 (
    echo Linting failed
    exit /b 1
)

REM Build the application
echo Building application...
if "%MODE%"=="production" (
    call npm run build:prod
) else if "%MODE%"=="staging" (
    call npm run build:staging
) else (
    call npm run build
)

if errorlevel 1 (
    echo Build failed
    exit /b 1
)

echo Build completed successfully!
echo Build output is in the 'dist' directory
echo.
echo To serve the built files:
echo   npm run preview:dist
echo.
echo To deploy to a web server, copy the contents of the 'dist' directory

endlocal