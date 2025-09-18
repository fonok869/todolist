@echo off
echo Starting Todo List Full Stack Application
echo.
echo Starting Backend (Spring Boot)...
start "Backend" cmd /k "cd todolist-backend && mvn spring-boot:run"

echo Waiting 10 seconds for backend to start...
timeout /t 10 /nobreak > nul

echo Starting Frontend (React + Vite)...
start "Frontend" cmd /k "cd todolist-frontend && npm run dev"

echo.
echo Full stack application is starting...
echo Backend will be available at: http://localhost:8080
echo Frontend will be available at: http://localhost:5175
echo.
echo Press any key to exit this window (applications will continue running)
pause > nul