#!/bin/bash

echo "=========================================="
echo "Starting Full Test Suite"
echo "=========================================="

# Function to cleanup processes
cleanup() {
    echo "Cleaning up servers..."
    # Kill backend and frontend processes
    if command -v lsof > /dev/null; then
        # Linux/Mac version
        if lsof -ti:8080 > /dev/null 2>&1; then
            kill $(lsof -ti:8080) 2>/dev/null || true
        fi
        if lsof -ti:5175 > /dev/null 2>&1; then
            kill $(lsof -ti:5175) 2>/dev/null || true
        fi
        if lsof -ti:5174 > /dev/null 2>&1; then
            kill $(lsof -ti:5174) 2>/dev/null || true
        fi
        if lsof -ti:5173 > /dev/null 2>&1; then
            kill $(lsof -ti:5173) 2>/dev/null || true
        fi
    else
        # Windows version using netstat and taskkill
        for port in 8080 5175 5174 5173; do
            netstat -ano | grep ":$port " | awk '{print $5}' | while read pid; do
                taskkill //F //PID $pid 2>/dev/null || true
            done
        done
    fi
}

# Cleanup any existing processes
echo "Cleaning up existing processes..."
cleanup

# Set trap to cleanup on exit
trap cleanup EXIT

echo
echo "Starting Backend Server (Test Mode)..."
cd todolist-backend
SPRING_PROFILES_ACTIVE=test mvn spring-boot:run &
BACKEND_PID=$!

# Wait for backend to start
echo "Waiting for backend to start..."
for i in {1..30}; do
    if curl -s http://localhost:8081/actuator/health > /dev/null 2>&1; then
        echo "✓ Backend is ready!"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "❌ Backend failed to start within 60 seconds"
        exit 1
    fi
    echo "Still waiting for backend... ($i/30)"
    sleep 2
done

echo
echo "Starting Frontend Server..."
cd ../todolist-app
npm run dev &
FRONTEND_PID=$!

# Wait for frontend to start
echo "Waiting for frontend to start..."
for i in {1..15}; do
    if curl -s http://localhost:5175 > /dev/null 2>&1; then
        echo "✓ Frontend is ready!"
        break
    fi
    if [ $i -eq 15 ]; then
        echo "❌ Frontend failed to start within 30 seconds"
        exit 1
    fi
    echo "Still waiting for frontend... ($i/15)"
    sleep 2
done

echo
echo "=========================================="
echo "Running Playwright Tests..."
echo "=========================================="

# Run the tests
npm run test:with-backend
TEST_RESULT=$?

echo
echo "=========================================="
if [ $TEST_RESULT -eq 0 ]; then
    echo "✅ All tests passed successfully!"
else
    echo "❌ Tests failed with error code $TEST_RESULT"
fi
echo "=========================================="
echo "Test Suite Complete"
echo "=========================================="

exit $TEST_RESULT