import { User } from './user.entity';
export declare class RefreshToken {
    id: string;
    userId: string;
    tokenId: string;
    expiresAt: Date;
    revoked: boolean;
    userAgent: string;
    ip: string;
    createdAt: Date;
    user: User;
}
