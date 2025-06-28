import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../entities/user.entity';
import { RefreshToken } from '../entities/refresh-token.entity';
import { LoginDto } from '../dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
    private jwtService: JwtService,
  ) {}

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

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user && await bcrypt.compare(password, user.passwordHash)) {
      return user;
    }
    return null;
  }

  async login(loginDto: LoginDto, userAgent: string, ip: string) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokenId = uuidv4();
    const accessToken = this.jwtService.sign(
      { 
        sub: user.id, 
        email: user.email,
        jti: tokenId,
        type: 'access'
      },
      { 
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: process.env.JWT_ACCESS_EXPIRY || '30m'
      }
    );

    const refreshToken = this.jwtService.sign(
      { 
        sub: user.id, 
        jti: tokenId,
        type: 'refresh'
      },
      { 
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d'
      }
    );

    // Store refresh token in database
    const refreshTokenEntity = this.refreshTokenRepository.create({
      userId: user.id,
      tokenId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
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

  async refresh(refreshToken: string, userAgent: string, ip: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Invalid token type');
      }

      // Check if refresh token exists and is not revoked
      const existingToken = await this.refreshTokenRepository.findOne({
        where: { tokenId: payload.jti, revoked: false },
        relations: ['user'],
      });

      if (!existingToken || existingToken.expiresAt < new Date()) {
        throw new UnauthorizedException('Invalid or expired refresh token');
      }

      // Check for token reuse (security measure)
      if (existingToken.userAgent !== userAgent || existingToken.ip !== ip) {
        // Revoke all tokens for this user (potential theft)
        await this.refreshTokenRepository.update(
          { userId: payload.sub },
          { revoked: true }
        );
        throw new ForbiddenException('Token reuse detected');
      }

      // Rotate refresh token (delete old, create new)
      await this.refreshTokenRepository.delete({ tokenId: payload.jti });

      const newTokenId = uuidv4();
      const newAccessToken = this.jwtService.sign(
        { 
          sub: payload.sub, 
          email: existingToken.user.email,
          jti: newTokenId,
          type: 'access'
        },
        { 
          secret: process.env.JWT_ACCESS_SECRET,
          expiresIn: process.env.JWT_ACCESS_EXPIRY || '30m'
        }
      );

      const newRefreshToken = this.jwtService.sign(
        { 
          sub: payload.sub, 
          jti: newTokenId,
          type: 'refresh'
        },
        { 
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d'
        }
      );

      // Store new refresh token
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
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      // Revoke the refresh token
      await this.refreshTokenRepository.update(
        { tokenId: payload.jti },
        { revoked: true }
      );
    } catch (error) {
      // Token might be invalid, but we still want to clear cookies
    }
  }

  async globalLogout(userId: string) {
    // Revoke all refresh tokens for the user
    await this.refreshTokenRepository.update(
      { userId },
      { revoked: true }
    );
  }
} 