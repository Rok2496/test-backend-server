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
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_service_1 = require("./app.service");
const auth_service_1 = require("./auth/auth.service");
const auth_dto_1 = require("./dto/auth.dto");
let AppController = class AppController {
    appService;
    authService;
    constructor(appService, authService) {
        this.appService = appService;
        this.authService = authService;
    }
    getHello() {
        return this.appService.getHello();
    }
    async setup() {
        const user = await this.authService.createTestUser();
        return {
            message: 'Test user created successfully',
            user: {
                id: user.id,
                email: user.email,
            },
            credentials: {
                email: 'test@example.com',
                password: 'password123',
            },
        };
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Health check',
        description: 'Simple health check endpoint',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Application is running',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "getHello", null);
__decorate([
    (0, common_1.Post)('setup'),
    (0, swagger_1.ApiOperation)({
        summary: 'Create test user',
        description: 'Creates a test user for demonstration purposes. Use these credentials to test the authentication flow.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Test user created successfully',
        type: auth_dto_1.SetupResponseDto,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "setup", null);
exports.AppController = AppController = __decorate([
    (0, swagger_1.ApiTags)('setup'),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [app_service_1.AppService,
        auth_service_1.AuthService])
], AppController);
//# sourceMappingURL=app.controller.js.map