export declare class LoginDto {
    email: string;
    password: string;
}
export declare class LoginResponseDto {
    user: {
        id: string;
        email: string;
    };
    message: string;
}
export declare class RefreshResponseDto {
    message: string;
}
export declare class LogoutResponseDto {
    message: string;
}
export declare class UserProfileDto {
    userId: string;
    email: string;
    message: string;
}
export declare class SetupResponseDto {
    message: string;
    user: {
        id: string;
        email: string;
    };
    credentials: {
        email: string;
        password: string;
    };
}
