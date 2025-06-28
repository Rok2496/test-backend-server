import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserProfileDto } from '../dto/auth.dto';

@ApiTags('profile')
@Controller('profile')
export class ProfileController {
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({
    summary: 'Get user profile',
    description: 'Retrieve current user profile information. Requires valid JWT access token.',
  })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
    type: UserProfileDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - Invalid or missing access token',
  })
  getProfile(@Request() req): UserProfileDto {
    return {
      userId: req.user.userId,
      email: req.user.email,
      message: 'This is a protected route',
    };
  }
} 