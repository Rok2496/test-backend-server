# JWT Authentication Backend

A NestJS backend implementing stateless JWT authentication with access and refresh tokens stored in httpOnly, Secure cookies.

## Features

- ✅ Access token (30 minutes expiry)
- ✅ Refresh token (7 days expiry) 
- ✅ Tokens stored in httpOnly, Secure cookies
- ✅ Refresh token rotation on every use
- ✅ Token reuse detection and global logout
- ✅ PostgreSQL database with TypeORM
- ✅ Protected routes with JWT guard
- ✅ **Swagger/OpenAPI documentation**

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create `.env` file:**
   ```env
   # PostgreSQL
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=postgres
   DB_DATABASE=auth_demo

   # JWT
   JWT_ACCESS_SECRET=your_access_secret_here
   JWT_REFRESH_SECRET=your_refresh_secret_here
   JWT_ACCESS_EXPIRY=1800s
   JWT_REFRESH_EXPIRY=7d
   ```

3. **Start PostgreSQL database**

4. **Run the application:**
   ```bash
   npm run start:dev
   ```

5. **Create test user:**
   ```bash
   curl -X POST http://localhost:3000/setup
   ```

## API Documentation

### Swagger UI
Once the application is running, visit the interactive API documentation:

**🌐 Swagger UI:** http://localhost:3000/api

The Swagger UI provides:
- Interactive API testing
- Request/response examples
- Authentication flow documentation
- Cookie-based token management
- Real-time API exploration

### Testing with Swagger
1. Open http://localhost:3000/api
2. Create test user: Execute `POST /setup`
3. Login: Execute `POST /auth/login` with test credentials
4. Test protected routes: Execute `GET /profile`
5. Refresh tokens: Execute `POST /auth/refresh`
6. Logout: Execute `POST /auth/logout`

## API Endpoints

### Authentication

#### POST /auth/login
Login with email and password.

**Request:**
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

**Response:**
- Sets `access_token` and `refresh_token` cookies
- Returns user info

#### POST /auth/refresh
Refresh access token using refresh token from cookie.

**Response:**
- Sets new `access_token` and `refresh_token` cookies
- Rotates refresh token (deletes old, creates new)

#### POST /auth/logout
Logout and revoke refresh token.

**Response:**
- Clears `access_token` and `refresh_token` cookies
- Revokes refresh token in database

### Protected Routes

#### GET /profile
Get user profile (requires authentication).

**Response:**
```json
{
  "userId": "uuid",
  "email": "test@example.com",
  "message": "This is a protected route"
}
```

### Setup

#### POST /setup
Create a test user for demonstration.

**Response:**
```json
{
  "message": "Test user created successfully",
  "user": {
    "id": "uuid",
    "email": "test@example.com"
  },
  "credentials": {
    "email": "test@example.com",
    "password": "password123"
  }
}
```

## Security Features

- **Token Rotation:** Refresh tokens are rotated on every use
- **Reuse Detection:** Detects token reuse and revokes all user tokens
- **Secure Cookies:** httpOnly, Secure, SameSite=Strict
- **Token Revocation:** Refresh tokens can be revoked in database
- **Global Logout:** Revokes all refresh tokens for a user
- **CSRF Protection:** SameSite cookies prevent CSRF attacks

## Database Schema

### Users Table
- `id` (UUID, Primary Key)
- `email` (String, Unique)
- `passwordHash` (String)
- `isActive` (Boolean)
- `createdAt` (Timestamp)
- `updatedAt` (Timestamp)

### Refresh Tokens Table
- `id` (UUID, Primary Key)
- `userId` (UUID, Foreign Key)
- `tokenId` (String, JWT jti claim)
- `expiresAt` (Timestamp)
- `revoked` (Boolean)
- `userAgent` (String, nullable)
- `ip` (String, nullable)
- `createdAt` (Timestamp)

## Testing

### Automated Testing
```bash
# Run the test script
./test-api.sh
```

### Manual Testing
1. Create test user: `POST /setup`
2. Login: `POST /auth/login` with test credentials
3. Access protected route: `GET /profile`
4. Refresh token: `POST /auth/refresh`
5. Logout: `POST /auth/logout`

### Swagger Testing
1. Visit http://localhost:3000/api
2. Use the interactive interface to test all endpoints
3. Cookies are automatically managed by the browser

## Development

### Available Scripts
```bash
# Development mode
npm run start:dev

# Production build
npm run build
npm run start:prod

# Tests
npm run test
npm run test:e2e
npm run test:cov
```

### Environment Variables
- `DB_HOST` - PostgreSQL host (default: localhost)
- `DB_PORT` - PostgreSQL port (default: 5432)
- `DB_USERNAME` - Database username (default: postgres)
- `DB_PASSWORD` - Database password (default: postgres)
- `DB_DATABASE` - Database name (default: auth_demo)
- `JWT_ACCESS_SECRET` - Secret for access tokens
- `JWT_REFRESH_SECRET` - Secret for refresh tokens
- `JWT_ACCESS_EXPIRY` - Access token expiry (default: 30m)
- `JWT_REFRESH_EXPIRY` - Refresh token expiry (default: 7d)
- `PORT` - Application port (default: 3000)
