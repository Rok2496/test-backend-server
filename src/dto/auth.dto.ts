import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'User email address',
    example: 'test@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password (minimum 6 characters)',
    example: 'password123',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;
}

export class LoginResponseDto {
  @ApiProperty({
    description: 'User information',
    example: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      email: 'test@example.com',
    },
  })
  user: {
    id: string;
    email: string;
  };

  @ApiProperty({
    description: 'Success message',
    example: 'Login successful',
  })
  message: string;
}

export class RefreshResponseDto {
  @ApiProperty({
    description: 'Success message',
    example: 'Token refreshed successfully',
  })
  message: string;
}

export class LogoutResponseDto {
  @ApiProperty({
    description: 'Success message',
    example: 'Logout successful',
  })
  message: string;
}

export class UserProfileDto {
  @ApiProperty({
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  userId: string;

  @ApiProperty({
    description: 'User email',
    example: 'test@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Profile message',
    example: 'This is a protected route',
  })
  message: string;
}

export class SetupResponseDto {
  @ApiProperty({
    description: 'Success message',
    example: 'Test user created successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Created user information',
    example: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      email: 'test@example.com',
    },
  })
  user: {
    id: string;
    email: string;
  };

  @ApiProperty({
    description: 'Test credentials for login',
    example: {
      email: 'test@example.com',
      password: 'password123',
    },
  })
  credentials: {
    email: string;
    password: string;
  };
} 