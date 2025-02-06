import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Assuming the request body contains a "userId" field.
  @Post('generate-registration-options')
  async generateRegistrationOptions(@Body() body: { userId: string }) {
    const { userId } = body;
    if (!userId) {
      throw new BadRequestException('User ID is required');
    }
    return await this.authService.generateRegistrationOptions(userId);
  }

  // Expects a registration response and the corresponding user ID in the body.
  @Post('verify-registration')
  async verifyRegistrationResponse(
    @Body() body: { userId: string; response: any },
  ) {
    const { userId, response } = body;
    if (!userId || !response) {
      throw new BadRequestException(
        'User ID and registration response are required',
      );
    }
    return await this.authService.verifyRegistrationResponse(userId, response);
  }

  // Assuming the request body contains a "userId" to generate authentication options.
  @Post('generate-authentication-options')
  async generateAuthenticationOptions(@Body() body: { userId: string }) {
    const { userId } = body;
    if (!userId) {
      throw new BadRequestException('User ID is required');
    }
    return await this.authService.generateAuthenticationOptions(userId);
  }

  // Expects an authentication response and the corresponding user ID in the body.
  @Post('verify-authentication')
  async verifyAuthenticationResponse(
    @Body() body: { userId: string; response: any },
  ) {
    const { userId, response } = body;
    if (!userId || !response) {
      throw new BadRequestException(
        'User ID and authentication response are required',
      );
    }
    return await this.authService.verifyAuthenticationResponse(
      userId,
      response,
    );
  }
}
