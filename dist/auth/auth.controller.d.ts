import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from '../dto/auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto, res: Response, req: Request): Promise<{
        user: {
            id: string;
            email: string;
        };
        message: string;
    }>;
    refresh(res: Response, req: Request): Promise<{
        message: string;
    }>;
    logout(res: Response, req: Request): Promise<{
        message: string;
    }>;
}
