# Testing Guide

This guide explains how to run Playwright tests with different backend configurations.

## Test Profiles Available

### 1. Development Profile (Default)
- Backend runs on port **8080**
- Uses development database configuration
- Full logging enabled

### 2. Test Profile
- Backend runs on port **8081**
- Uses isolated test database (`todolist-test`)
- Reduced logging for better performance
- Optimized for automated testing

## Running Tests

### Prerequisites
1. Make sure both backend and frontend dependencies are installed:
   ```bash
   # Install backend dependencies
   cd todolist-backend
   mvn install
   
   # Install frontend dependencies
   cd ../todolist-frontend
   npm install
   ```

### Option 1: Tests Against Development Backend (Default)
```bash
cd todolist-frontend
npm run test           # Run tests headless
npm run test:ui        # Run tests with UI
npm run test:headed    # Run tests in headed mode
npm run test:debug     # Debug tests
```

### Option 2: Tests Against Test Backend Profile
```bash
# Terminal 1: Start backend with test profile
cd todolist-backend
./run-test-server.sh      # On Linux/Mac
# OR
run-test-server.bat       # On Windows

# Terminal 2: Run tests against test backend
cd todolist-frontend
npm run test:with-backend       # Run tests headless
npm run test:with-backend:ui    # Run tests with UI
```

### Option 3: Manual Backend Control
```bash
# Start backend manually with test profile
cd todolist-backend
mvn spring-boot:run -Dspring-boot.run.profiles=test

# In another terminal, run tests
cd todolist-frontend
TEST_PROFILE=test npm run test
```

## Test Configuration Details

### Backend Test Profile
- **Database**: H2 in-memory (`todolist-test`)
- **Port**: 8081
- **Console**: Disabled
- **Logging**: Reduced for performance

### Frontend Test Configuration
- **Port**: 5175 (configurable via FRONTEND_PORT)
- **API Base URL**: Auto-configured based on TEST_PROFILE
- **Browser**: Chromium (default)

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `TEST_PROFILE` | Backend profile (`test` or empty) | empty (dev) |
| `FRONTEND_PORT` | Frontend dev server port | 5175 |

## Test Database

When using the test profile:
- Database is completely isolated from development
- Fresh database created on each backend startup
- No data persistence between runs
- Automatic schema creation from JPA entities

## Troubleshooting

### Port Conflicts
- Development backend: 8080
- Test backend: 8081
- Frontend: 5175

### Database Issues
Test profile uses a separate in-memory database, so no conflicts with development data.

### Test Failures
1. Ensure backend is running on the correct port
2. Check if test profile is properly activated
3. Verify frontend can reach the backend API
4. Check browser console for errors during tests

## CI/CD Integration

For automated testing in CI/CD pipelines:
```bash
# Start backend in background
mvn spring-boot:run -Dspring-boot.run.profiles=test &

# Wait for backend to start
sleep 30

# Run tests
cd todolist-frontend
TEST_PROFILE=test npm run test

# Cleanup
pkill -f "spring-boot:run"
```