#!/bin/bash

echo "Starting Todo List Full Stack Application"
echo ""
echo "Starting Backend (Spring Boot)..."
cd todolist-backend
mvn spring-boot:run &
BACKEND_PID=$!
cd ..

echo "Waiting 15 seconds for backend to start..."
sleep 15

echo "Starting Frontend (React + Vite)..."
cd todolist-frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "Full stack application is running..."
echo "Backend PID: $BACKEND_PID - Available at: http://localhost:8080"
echo "Frontend PID: $FRONTEND_PID - Available at: http://localhost:5175"
echo ""
echo "Press Ctrl+C to stop both applications"

# Function to cleanup background processes
cleanup() {
    echo ""
    echo "Stopping applications..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

# Set trap to catch interrupt signal
trap cleanup INT

# Wait for user interrupt
wait