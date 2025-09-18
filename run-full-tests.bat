@echo off
setlocal EnableDelayedExpansion

echo ==========================================
echo Starting Full Test Suite
echo ==========================================

REM Kill any existing processes on the ports
echo Cleaning up existing processes...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8080') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5173') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5174') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5175') do taskkill /f /pid %%a >nul 2>&1

echo.
echo Starting Backend Server (Test Mode)...
cd todolist-backend
start "Backend Server" cmd /c "set SPRING_PROFILES_ACTIVE=test && mvn spring-boot:run"

REM Wait for backend to start
echo Waiting for backend to start...
:waitbackend
timeout /t 2 /nobreak >nul
curl -s http://localhost:8080/actuator/health >nul 2>&1
if errorlevel 1 (
    echo Still waiting for backend...
    goto waitbackend
)
echo ✓ Backend is ready!

echo.
echo Starting Frontend Server...
cd ..\todolist-frontend
start "Frontend Server" cmd /c "npm run dev"

REM Wait for frontend to start
echo Waiting for frontend to start...
:waitfrontend
timeout /t 2 /nobreak >nul
curl -s http://localhost:5175 >nul 2>&1
if errorlevel 1 (
    echo Still waiting for frontend...
    goto waitfrontend
)
echo ✓ Frontend is ready!

echo.
echo ==========================================
echo Running Playwright Tests...
echo ==========================================

REM Run the tests
npm run test:with-backend

set TEST_RESULT=!errorlevel!

echo.
echo ==========================================
echo Cleaning up servers...
echo ==========================================

REM Kill the servers
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8080') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5175') do taskkill /f /pid %%a >nul 2>&1

echo.
if !TEST_RESULT! equ 0 (
    echo ✅ All tests passed successfully!
) else (
    echo ❌ Tests failed with error code !TEST_RESULT!
)

echo ==========================================
echo Test Suite Complete
echo ==========================================

exit /b !TEST_RESULT!