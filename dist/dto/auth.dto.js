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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetupResponseDto = exports.UserProfileDto = exports.LogoutResponseDto = exports.RefreshResponseDto = exports.LoginResponseDto = exports.LoginDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class LoginDto {
    email;
    password;
}
exports.LoginDto = LoginDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User email address',
        example: 'test@example.com',
    }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], LoginDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User password (minimum 6 characters)',
        example: 'password123',
        minLength: 6,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    __metadata("design:type", String)
], LoginDto.prototype, "password", void 0);
class LoginResponseDto {
    user;
    message;
}
exports.LoginResponseDto = LoginResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User information',
        example: {
            id: '123e4567-e89b-12d3-a456-426614174000',
            email: 'test@example.com',
        },
    }),
    __metadata("design:type", Object)
], LoginResponseDto.prototype, "user", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Success message',
        example: 'Login successful',
    }),
    __metadata("design:type", String)
], LoginResponseDto.prototype, "message", void 0);
class RefreshResponseDto {
    message;
}
exports.RefreshResponseDto = RefreshResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Success message',
        example: 'Token refreshed successfully',
    }),
    __metadata("design:type", String)
], RefreshResponseDto.prototype, "message", void 0);
class LogoutResponseDto {
    message;
}
exports.LogoutResponseDto = LogoutResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Success message',
        example: 'Logout successful',
    }),
    __metadata("design:type", String)
], LogoutResponseDto.prototype, "message", void 0);
class UserProfileDto {
    userId;
    email;
    message;
}
exports.UserProfileDto = UserProfileDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User ID',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    __metadata("design:type", String)
], UserProfileDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User email',
        example: 'test@example.com',
    }),
    __metadata("design:type", String)
], UserProfileDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Profile message',
        example: 'This is a protected route',
    }),
    __metadata("design:type", String)
], UserProfileDto.prototype, "message", void 0);
class SetupResponseDto {
    message;
    user;
    credentials;
}
exports.SetupResponseDto = SetupResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Success message',
        example: 'Test user created successfully',
    }),
    __metadata("design:type", String)
], SetupResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Created user information',
        example: {
            id: '123e4567-e89b-12d3-a456-426614174000',
            email: 'test@example.com',
        },
    }),
    __metadata("design:type", Object)
], SetupResponseDto.prototype, "user", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Test credentials for login',
        example: {
            email: 'test@example.com',
            password: 'password123',
        },
    }),
    __metadata("design:type", Object)
], SetupResponseDto.prototype, "credentials", void 0);
//# sourceMappingURL=auth.dto.js.map