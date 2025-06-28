"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("./auth.service");
const auth_dto_1 = require("../dto/auth.dto");
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async login(loginDto, res, req) {
        const userAgent = req.get('User-Agent') || '';
        const ip = req.ip || req.connection.remoteAddress || '';
        const result = await this.authService.login(loginDto, userAgent, ip);
        res.cookie('access_token', result.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 30 * 60 * 1000,
            path: '/',
        });
        res.cookie('refresh_token', result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/',
        });
        return {
            user: result.user,
            message: 'Login successful',
        };
    }
    async refresh(res, req) {
        const refreshToken = req.cookies?.refresh_token;
        if (!refreshToken) {
            res.status(common_1.HttpStatus.UNAUTHORIZED);
            return { message: 'No refresh token provided' };
        }
        const userAgent = req.get('User-Agent') || '';
        const ip = req.ip || req.connection.remoteAddress || '';
        try {
            const result = await this.authService.refresh(refreshToken, userAgent, ip);
            res.cookie('access_token', result.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 30 * 60 * 1000,
                path: '/',
            });
            res.cookie('refresh_token', result.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000,
                path: '/',
            });
            return { message: 'Token refreshed successfully' };
        }
        catch (error) {
            res.status(common_1.HttpStatus.UNAUTHORIZED);
            return { message: 'Invalid refresh token' };
        }
    }
    async logout(res, req) {
        const refreshToken = req.cookies?.refresh_token;
        if (refreshToken) {
            await this.authService.logout(refreshToken);
        }
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
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('login'),
    (0, swagger_1.ApiOperation)({
        summary: 'User login',
        description: 'Authenticate user with email and password, returns JWT tokens in httpOnly cookies',
    }),
    (0, swagger_1.ApiBody)({
        type: auth_dto_1.LoginDto,
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
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Login successful - tokens set in httpOnly cookies',
        type: auth_dto_1.LoginResponseDto,
        headers: {
            'Set-Cookie': {
                description: 'JWT tokens set as httpOnly cookies',
                schema: {
                    type: 'string',
                    example: 'access_token=eyJ...; HttpOnly; Secure; SameSite=Strict',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
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
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'Invalid request body or validation errors',
    }),
    (0, swagger_1.ApiInternalServerErrorResponse)({
        description: 'Internal server error',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.LoginDto, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('refresh'),
    (0, swagger_1.ApiOperation)({
        summary: 'Refresh access token',
        description: 'Refresh access token using refresh token from cookie. Rotates refresh token for security.',
    }),
    (0, swagger_1.ApiCookieAuth)('refresh_token'),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Token refreshed successfully - new tokens set in httpOnly cookies',
        type: auth_dto_1.RefreshResponseDto,
        headers: {
            'Set-Cookie': {
                description: 'New JWT tokens set as httpOnly cookies',
                schema: {
                    type: 'string',
                    example: 'access_token=eyJ...; HttpOnly; Secure; SameSite=Strict',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Invalid or expired refresh token',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Invalid refresh token' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
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
    }),
    __param(0, (0, common_1.Res)({ passthrough: true })),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, swagger_1.ApiOperation)({
        summary: 'User logout',
        description: 'Logout user and revoke refresh token. Clears all authentication cookies.',
    }),
    (0, swagger_1.ApiCookieAuth)('refresh_token'),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Logout successful - cookies cleared',
        type: auth_dto_1.LogoutResponseDto,
        headers: {
            'Set-Cookie': {
                description: 'Authentication cookies cleared',
                schema: {
                    type: 'string',
                    example: 'access_token=; Max-Age=0; HttpOnly; Secure; SameSite=Strict',
                },
            },
        },
    }),
    __param(0, (0, common_1.Res)({ passthrough: true })),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('auth'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map