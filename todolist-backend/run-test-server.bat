@echo off
echo Starting Spring Boot with test profile...
echo Backend will run on http://localhost:8081
echo.
mvn spring-boot:run -Dspring-boot.run.profiles=test