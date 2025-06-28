import { RefreshToken } from './refresh-token.entity';
export declare class User {
    id: string;
    email: string;
    passwordHash: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    refreshTokens: RefreshToken[];
}
