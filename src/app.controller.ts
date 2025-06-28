import { Controller, Get, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { SetupResponseDto } from './dto/auth.dto';

@ApiTags('setup')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Health check',
    description: 'Simple health check endpoint',
  })
  @ApiResponse({
    status: 200,
    description: 'Application is running',
  })
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('setup')
  @ApiOperation({
    summary: 'Create test user',
    description: 'Creates a test user for demonstration purposes. Use these credentials to test the authentication flow.',
  })
  @ApiResponse({
    status: 201,
    description: 'Test user created successfully',
    type: SetupResponseDto,
  })
  async setup(): Promise<SetupResponseDto> {
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
}
