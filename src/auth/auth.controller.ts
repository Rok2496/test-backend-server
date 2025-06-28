import { Controller, Post, Body, Res, Req, HttpStatus } from '@nestjs/common';
import { Response, Request } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiCookieAuth, ApiBadRequestResponse, ApiInternalServerErrorResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto, LoginResponseDto, RefreshResponseDto, LogoutResponseDto } from '../dto/auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({
    summary: 'User login',
    description: 'Authenticate user with email and password, returns JWT tokens in httpOnly cookies',
  })
  @ApiBody({
    type: LoginDto,
    description: 'User credentials',
    examples: {
      testUser: {
        summary: 'Test User Credentials',
        value: {
          email: 'test@example.com',
          password: 'password123',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful - tokens set in httpOnly cookies',
    type: LoginResponseDto,
    headers: {
      'Set-Cookie': {
        description: 'JWT tokens set as httpOnly cookies',
        schema: {
          type: 'string',
          example: 'access_token=eyJ...; HttpOnly; Secure; SameSite=Strict',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Invalid credentials' },
        error: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid request body or validation errors',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ) {
    const userAgent = req.get('User-Agent') || '';
    const ip = req.ip || req.connection.remoteAddress || '';

    const result = await this.authService.login(loginDto, userAgent, ip);

    // Set cookies
    res.cookie('access_token', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 60 * 1000, // 30 minutes
      path: '/',
    });

    res.cookie('refresh_token', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
    });

    return {
      user: result.user,
      message: 'Login successful',
    };
  }

  @Post('refresh')
  @ApiOperation({
    summary: 'Refresh access token',
    description: 'Refresh access token using refresh token from cookie. Rotates refresh token for security.',
  })
  @ApiCookieAuth('refresh_token')
  @ApiResponse({
    status: 200,
    description: 'Token refreshed successfully - new tokens set in httpOnly cookies',
    type: RefreshResponseDto,
    headers: {
      'Set-Cookie': {
        description: 'New JWT tokens set as httpOnly cookies',
        schema: {
          type: 'string',
          example: 'access_token=eyJ...; HttpOnly; Secure; SameSite=Strict',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or expired refresh token',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Invalid refresh token' },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Token reuse detected - all tokens revoked',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 403 },
        message: { type: 'string', example: 'Token reuse detected' },
        error: { type: 'string', example: 'Forbidden' },
      },
    },
  })
  async refresh(
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ) {
    const refreshToken = req.cookies?.refresh_token;
    if (!refreshToken) {
      res.status(HttpStatus.UNAUTHORIZED);
      return { message: 'No refresh token provided' };
    }

    const userAgent = req.get('User-Agent') || '';
    const ip = req.ip || req.connection.remoteAddress || '';

    try {
      const result = await this.authService.refresh(refreshToken, userAgent, ip);

      // Set new cookies
      res.cookie('access_token', result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 60 * 1000, // 30 minutes
        path: '/',
      });

      res.cookie('refresh_token', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: '/',
      });

      return { message: 'Token refreshed successfully' };
    } catch (error) {
      res.status(HttpStatus.UNAUTHORIZED);
      return { message: 'Invalid refresh token' };
    }
  }

  @Post('logout')
  @ApiOperation({
    summary: 'User logout',
    description: 'Logout user and revoke refresh token. Clears all authentication cookies.',
  })
  @ApiCookieAuth('refresh_token')
  @ApiResponse({
    status: 200,
    description: 'Logout successful - cookies cleared',
    type: LogoutResponseDto,
    headers: {
      'Set-Cookie': {
        description: 'Authentication cookies cleared',
        schema: {
          type: 'string',
          example: 'access_token=; Max-Age=0; HttpOnly; Secure; SameSite=Strict',
        },
      },
    },
  })
  async logout(
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ) {
    const refreshToken = req.cookies?.refresh_token;
    
    if (refreshToken) {
      await this.authService.logout(refreshToken);
    }

    // Clear cookies
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });

    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });

    return { message: 'Logout successful' };
  }
} 