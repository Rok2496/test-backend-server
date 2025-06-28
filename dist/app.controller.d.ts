import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { SetupResponseDto } from './dto/auth.dto';
export declare class AppController {
    private readonly appService;
    private readonly authService;
    constructor(appService: AppService, authService: AuthService);
    getHello(): string;
    setup(): Promise<SetupResponseDto>;
}
