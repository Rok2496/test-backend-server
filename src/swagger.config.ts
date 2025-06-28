import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('JWT Authentication API')
  .setDescription(`
    ## Overview
    A NestJS backend implementing stateless JWT authentication with access and refresh tokens stored in httpOnly, Secure cookies.

    ## Authentication Flow
    1. **Login** - POST /auth/login with credentials
    2. **Access Protected Routes** - Use the access token from cookies
    3. **Refresh** - POST /auth/refresh when access token expires
    4. **Logout** - POST /auth/logout to revoke tokens

    ## Security Features
    - ✅ Access tokens (30 minutes expiry)
    - ✅ Refresh tokens (7 days expiry)
    - ✅ Tokens stored in httpOnly, Secure cookies
    - ✅ Refresh token rotation on every use
    - ✅ Token reuse detection and global logout
    - ✅ CSRF protection via SameSite cookies

    ## Testing
    1. Create test user: POST /setup
    2. Login: POST /auth/login with test credentials
    3. Access protected route: GET /profile
    4. Refresh token: POST /auth/refresh
    5. Logout: POST /auth/logout

    ## Cookie Authentication
    This API uses httpOnly cookies for token storage. The Swagger UI will automatically include cookies in requests when testing endpoints.
  `)
  .setVersion('1.0')
  .addTag('auth', 'Authentication endpoints (login, refresh, logout)')
  .addTag('profile', 'Protected user profile endpoints')
  .addTag('setup', 'Setup and utility endpoints')
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Enter JWT token (for testing purposes - tokens are stored in cookies)',
      in: 'header',
    },
    'JWT-auth',
  )
  .addCookieAuth('access_token', {
    type: 'apiKey',
    in: 'cookie',
    name: 'access_token',
    description: 'JWT access token stored in httpOnly cookie',
  })
  .addCookieAuth('refresh_token', {
    type: 'apiKey',
    in: 'cookie',
    name: 'refresh_token',
    description: 'JWT refresh token stored in httpOnly cookie',
  })
  .build(); 