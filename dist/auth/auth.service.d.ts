import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { RefreshToken } from '../entities/refresh-token.entity';
import { LoginDto } from '../dto/auth.dto';
export declare class AuthService {
    private userRepository;
    private refreshTokenRepository;
    private jwtService;
    constructor(userRepository: Repository<User>, refreshTokenRepository: Repository<RefreshToken>, jwtService: JwtService);
    createTestUser(): Promise<User>;
    validateUser(email: string, password: string): Promise<User | null>;
    login(loginDto: LoginDto, userAgent: string, ip: string): Promise<{
        user: {
            id: string;
            email: string;
        };
        accessToken: string;
        refreshToken: string;
    }>;
    refresh(refreshToken: string, userAgent: string, ip: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(refreshToken: string): Promise<void>;
    globalLogout(userId: string): Promise<void>;
}
