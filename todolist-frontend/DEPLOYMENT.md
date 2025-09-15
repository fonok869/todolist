# TodoList Frontend Deployment Guide

This guide explains how to build and deploy the TodoList frontend application for different environments, including virtual machines.

## Quick Start

### Command Line Build with Backend URL

You can specify the backend URL directly when building:

#### Linux/Mac:
```bash
./build-for-vm.sh http://your-backend-server:8080 production
```

#### Windows:
```cmd
build-for-vm.bat http://your-backend-server:8080 production
```

## Environment Configuration

### Environment Variables

The application uses the following environment variables:

- `VITE_API_BASE_URL`: Backend API base URL (default: http://localhost:8080)
- `VITE_APP_TITLE`: Application title
- `VITE_APP_VERSION`: Application version
- `VITE_DEV_MODE`: Development mode flag

### Build Modes

- **development**: Local development with hot reload
- **staging**: Staging environment build
- **production**: Production-optimized build

## Build Scripts

### NPM Scripts

- `npm run build`: Standard build
- `npm run build:prod`: Production build
- `npm run build:staging`: Staging build
- `npm run preview:dist`: Serve built files locally

### Custom Build Scripts

Use the provided scripts for VM deployment:

- `build-for-vm.sh` (Linux/Mac)
- `build-for-vm.bat` (Windows)

## Manual Build Process

### 1. Set Environment Variables

#### Linux/Mac:
```bash
export VITE_API_BASE_URL=http://your-backend-server:8080
```

#### Windows:
```cmd
set VITE_API_BASE_URL=http://your-backend-server:8080
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Build Application
```bash
npm run build:prod
```

### 4. Deploy
Copy the contents of the `dist` directory to your web server.

## Environment Files

The project supports environment-specific configuration files:

- `.env`: Default environment variables
- `.env.production`: Production environment
- `.env.staging`: Staging environment

## VM Deployment Examples

### Example 1: Local VM
```bash
./build-for-vm.sh http://192.168.1.100:8080 production
```

### Example 2: Cloud VM
```bash
./build-for-vm.sh https://api.yourdomain.com production
```

### Example 3: Docker Container
```bash
./build-for-vm.sh http://todolist-backend:8080 production
```

## Testing the Build

After building, you can test the application locally:

```bash
npm run preview:dist
```

This will serve the built files on http://localhost:4173

## Deployment Checklist

- [ ] Backend API is accessible from the target environment
- [ ] CORS is properly configured in the backend
- [ ] Environment variables are set correctly
- [ ] Build completed without errors
- [ ] Static files are served correctly
- [ ] API calls work from the deployed frontend

## Common Issues

### CORS Errors
Ensure the backend CORS configuration allows requests from your frontend domain.

### API Connection Issues
Verify that the backend URL is accessible from the client browser, not just the build server.

### Build Failures
Check that all dependencies are installed and TypeScript compilation succeeds.

## Web Server Configuration

### Nginx Example
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Apache Example
```apache
<VirtualHost *:80>
    ServerName your-domain.com
    DocumentRoot /path/to/dist

    <Directory /path/to/dist>
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>
</VirtualHost>
```