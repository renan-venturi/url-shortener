import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiBody({
    schema: {
      example: { email: 'user@example.com', password: 'password123' },
    },
  })
  async login(@Body() body: { email: string; password: string }) {
    try {
      return await this.authService.signIn(body.email, body.password);
    } catch (error) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
  }
}
