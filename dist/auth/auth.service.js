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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcrypt");
const uuid_1 = require("uuid");
const user_entity_1 = require("../entities/user.entity");
const refresh_token_entity_1 = require("../entities/refresh-token.entity");
let AuthService = class AuthService {
    userRepository;
    refreshTokenRepository;
    jwtService;
    constructor(userRepository, refreshTokenRepository, jwtService) {
        this.userRepository = userRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.jwtService = jwtService;
    }
    async createTestUser() {
        const existingUser = await this.userRepository.findOne({ where: { email: 'test@example.com' } });
        if (existingUser) {
            return existingUser;
        }
        const passwordHash = await bcrypt.hash('password123', 10);
        const user = this.userRepository.create({
            email: 'test@example.com',
            passwordHash,
        });
        return await this.userRepository.save(user);
    }
    async validateUser(email, password) {
        const user = await this.userRepository.findOne({ where: { email } });
        if (user && await bcrypt.compare(password, user.passwordHash)) {
            return user;
        }
        return null;
    }
    async login(loginDto, userAgent, ip) {
        const user = await this.validateUser(loginDto.email, loginDto.password);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const tokenId = (0, uuid_1.v4)();
        const accessToken = this.jwtService.sign({
            sub: user.id,
            email: user.email,
            jti: tokenId,
            type: 'access'
        }, {
            secret: process.env.JWT_ACCESS_SECRET,
            expiresIn: process.env.JWT_ACCESS_EXPIRY || '30m'
        });
        const refreshToken = this.jwtService.sign({
            sub: user.id,
            jti: tokenId,
            type: 'refresh'
        }, {
            secret: process.env.JWT_REFRESH_SECRET,
            expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d'
        });
        const refreshTokenEntity = this.refreshTokenRepository.create({
            userId: user.id,
            tokenId,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            userAgent,
            ip,
        });
        await this.refreshTokenRepository.save(refreshTokenEntity);
        return {
            user: {
                id: user.id,
                email: user.email,
            },
            accessToken,
            refreshToken,
        };
    }
    async refresh(refreshToken, userAgent, ip) {
        try {
            const payload = this.jwtService.verify(refreshToken, {
                secret: process.env.JWT_REFRESH_SECRET,
            });
            if (payload.type !== 'refresh') {
                throw new common_1.UnauthorizedException('Invalid token type');
            }
            const existingToken = await this.refreshTokenRepository.findOne({
                where: { tokenId: payload.jti, revoked: false },
                relations: ['user'],
            });
            if (!existingToken || existingToken.expiresAt < new Date()) {
                throw new common_1.UnauthorizedException('Invalid or expired refresh token');
            }
            if (existingToken.userAgent !== userAgent || existingToken.ip !== ip) {
                await this.refreshTokenRepository.update({ userId: payload.sub }, { revoked: true });
                throw new common_1.ForbiddenException('Token reuse detected');
            }
            await this.refreshTokenRepository.delete({ tokenId: payload.jti });
            const newTokenId = (0, uuid_1.v4)();
            const newAccessToken = this.jwtService.sign({
                sub: payload.sub,
                email: existingToken.user.email,
                jti: newTokenId,
                type: 'access'
            }, {
                secret: process.env.JWT_ACCESS_SECRET,
                expiresIn: process.env.JWT_ACCESS_EXPIRY || '30m'
            });
            const newRefreshToken = this.jwtService.sign({
                sub: payload.sub,
                jti: newTokenId,
                type: 'refresh'
            }, {
                secret: process.env.JWT_REFRESH_SECRET,
                expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d'
            });
            const newRefreshTokenEntity = this.refreshTokenRepository.create({
                userId: payload.sub,
                tokenId: newTokenId,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                userAgent,
                ip,
            });
            await this.refreshTokenRepository.save(newRefreshTokenEntity);
            return {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
            };
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
    }
    async logout(refreshToken) {
        try {
            const payload = this.jwtService.verify(refreshToken, {
                secret: process.env.JWT_REFRESH_SECRET,
            });
            await this.refreshTokenRepository.update({ tokenId: payload.jti }, { revoked: true });
        }
        catch (error) {
        }
    }
    async globalLogout(userId) {
        await this.refreshTokenRepository.update({ userId }, { revoked: true });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(refresh_token_entity_1.RefreshToken)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map