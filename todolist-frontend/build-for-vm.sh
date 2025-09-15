#!/bin/bash

# Build script for VM deployment
# Usage: ./build-for-vm.sh [backend_url] [mode]
# Example: ./build-for-vm.sh http://192.168.1.100:8080 production

set -e

BACKEND_URL="${1:-http://localhost:8080}"
MODE="${2:-production}"

echo "Building TodoList Frontend for VM deployment..."
echo "Backend URL: $BACKEND_URL"
echo "Mode: $MODE"

# Set environment variable for build
export VITE_API_BASE_URL="$BACKEND_URL"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Run linting
echo "Running linting..."
npm run lint

# Build the application
echo "Building application..."
if [ "$MODE" = "production" ]; then
    npm run build:prod
elif [ "$MODE" = "staging" ]; then
    npm run build:staging
else
    npm run build
fi

echo "Build completed successfully!"
echo "Build output is in the 'dist' directory"
echo ""
echo "To serve the built files:"
echo "  npm run preview:dist"
echo ""
echo "To deploy to a web server, copy the contents of the 'dist' directory"