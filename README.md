# TodoList Application

A full-stack Todo List application built with React TypeScript frontend and Spring Boot backend.

## 🏗️ Project Structure

```
todolist/
├── todolist-frontend/     # React + TypeScript + Vite frontend
├── todolist-backend/      # Spring Boot backend
└── README.md             # This file
```

## 🔧 Environment Configuration

### Backend Configuration (Spring Boot)

The backend uses environment-specific configuration files to manage sensitive data securely.

#### Configuration Files:
- `application.properties` - Default configuration (safe for public repo)
- `application-dev.properties` - Development secrets (gitignored)
- `application-prod.properties` - Production secrets (gitignored)
- `application.properties.example` - Template for developers

#### Required Environment Variables:

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `JWT_SECRET` | Secret key for JWT token signing | `your-256-bit-secret` | ✅ |
| `DATABASE_URL` | Database connection URL | `jdbc:postgresql://localhost:5432/todolist` | For production |
| `DATABASE_USERNAME` | Database username | `todoapp` | For production |
| `DATABASE_PASSWORD` | Database password | `secure-password` | For production |
| `SPRING_PROFILES_ACTIVE` | Active Spring profile | `dev`, `prod` | ✅ |
| `CORS_ALLOWED_ORIGINS` | Allowed CORS origins | `http://localhost:3000,https://myapp.com` | Optional |

#### Setting up Development Environment:

1. Copy the example configuration:
   ```bash
   cd todolist-backend/src/main/resources
   cp application.properties.example application-dev.properties
   ```

2. Edit `application-dev.properties` and add your secure values:
   ```properties
   jwt.secret=your-secure-jwt-secret-at-least-32-characters
   spring.h2.console.enabled=true
   # ... other development settings
   ```

3. Set your active profile:
   ```bash
   export SPRING_PROFILES_ACTIVE=dev
   ```

#### Production Deployment:

For production, use environment variables instead of files:

```bash
export JWT_SECRET="your-production-jwt-secret"
export DATABASE_URL="jdbc:postgresql://prod-db:5432/todolist"
export DATABASE_USERNAME="prod_user"
export DATABASE_PASSWORD="super_secure_password"
export SPRING_PROFILES_ACTIVE="prod"
export CORS_ALLOWED_ORIGINS="https://yourdomain.com"
```

### Frontend Configuration (React + Vite)

The frontend uses `.env` files for configuration.

#### Configuration Files:
- `.env.example` - Template (committed to repo)
- `.env` - Local development (gitignored)
- `.env.production` - Production build (gitignored)
- `.env.staging` - Staging environment (gitignored)

#### Available Variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API URL | `http://localhost:8080` |
| `VITE_APP_TITLE` | Application title | `TodoList App` |
| `VITE_APP_VERSION` | App version | `1.0.0` |
| `VITE_DEV_MODE` | Development mode flag | `true` |

#### Setting up Frontend Environment:

1. Copy the example configuration:
   ```bash
   cd todolist-frontend
   cp .env.example .env
   ```

2. Edit `.env` with your local settings:
   ```
   VITE_API_BASE_URL=http://localhost:8080
   VITE_APP_TITLE=TodoList App (Dev)
   VITE_DEV_MODE=true
   ```

## 🚀 Getting Started

### Prerequisites
- Java 17+
- Node.js 18+
- Maven 3.6+

### Backend Setup
```bash
cd todolist-backend
cp src/main/resources/application.properties.example src/main/resources/application-dev.properties
# Edit application-dev.properties with your settings
mvn spring-boot:run
```

### Frontend Setup
```bash
cd todolist-frontend
cp .env.example .env
# Edit .env with your settings
npm install
npm run dev
```

## 🔒 Security Best Practices

### ⚠️ Important Security Notes:

1. **Never commit sensitive data** to the repository
2. **Generate strong JWT secrets** (minimum 256 bits / 32 characters)
3. **Use environment variables** in production
4. **Regularly rotate secrets** especially if they may have been exposed

### Generating Secure JWT Secrets:

```bash
# Generate a secure 256-bit secret
openssl rand -base64 32
```

### What's Protected:
- ✅ JWT secrets are environment-specific
- ✅ Database credentials use environment variables
- ✅ Sensitive config files are gitignored
- ✅ Production URLs are not hardcoded

### Git Security:
- All `application-*.properties` files (except .example) are gitignored
- All `.env` files (except .example) are gitignored
- Target directories and build artifacts are gitignored

## 📁 Configuration File Reference

### Safe for Git (Public Repository):
- ✅ `application.properties` - Default values only
- ✅ `application.properties.example` - Template
- ✅ `.env.example` - Template

### Not Safe for Git (Gitignored):
- 🔒 `application-dev.properties` - Development secrets
- 🔒 `application-prod.properties` - Production secrets
- 🔒 `.env` - Local environment variables
- 🔒 `.env.production` - Production environment variables

## 🛠️ Development Commands

### Backend
```bash
cd todolist-backend
mvn clean install          # Build
mvn spring-boot:run         # Run development server
mvn test                    # Run tests
```

### Frontend
```bash
cd todolist-frontend
npm install                 # Install dependencies
npm run dev                 # Start development server
npm run build               # Build for production
npm run lint                # Run linting
```

## 📚 Additional Resources

- [Spring Boot Configuration](https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.external-config)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [JWT Best Practices](https://tools.ietf.org/html/rfc7519)

---

**Note**: This project follows security best practices for environment configuration. If you find any security issues, please report them immediately.