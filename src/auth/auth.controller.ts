import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Res,
  UseGuards,
  Get,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import {
  AuthenticationResponseJSON,
  RegistrationResponseJSON,
} from '@simplewebauthn/server';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @Get('ping')
  ping() {
    return { msg: 'pong' };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.cookie('jwt', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: new Date(0),
    });
    return { message: 'Logged out successfully' };
  }

  @Post('generate-registration-options')
  async generateRegistrationOptions(
    @Body() body: { userId?: string; username?: string },
  ) {
    const { userId, username } = body;
    if (!userId && !username) {
      throw new BadRequestException('Either userId or username is required');
    }
    return await this.authService.generateRegistrationOptions({
      userId,
      username,
    });
  }

  @Post('verify-registration')
  async verifyRegistrationResponse(
    @Body() body: { userId: string; response: RegistrationResponseJSON },
    @Res({ passthrough: true }) res: Response,
  ) {
    const { userId, response } = body;
    if (!userId || !response) {
      throw new BadRequestException(
        'User ID and registration response are required',
      );
    }
    const result = await this.authService.verifyRegistrationResponse(
      userId,
      response,
    );

    if (result.verification.verified && result.token) {
      res.cookie('jwt', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 3600000,
      });
    }
    return result.verification;
  }

  @Post('generate-authentication-options')
  async generateAuthenticationOptions(
    @Body() body: { userId?: string; username?: string },
  ) {
    const { userId, username } = body;
    if (!userId && !username) {
      throw new BadRequestException('Either userId or username is required');
    }
    return await this.authService.generateAuthenticationOptions({
      userId,
      username,
    });
  }

  @Post('verify-authentication')
  async verifyAuthenticationResponse(
    @Body() body: { userId: string; response: AuthenticationResponseJSON },
    @Res({ passthrough: true }) res: Response,
  ) {
    const { userId, response } = body;
    if (!userId || !response) {
      throw new BadRequestException(
        'User ID and authentication response are required',
      );
    }
    const result = await this.authService.verifyAuthenticationResponse(
      userId,
      response,
    );
    if (result.verified && result.token) {
      res.cookie('jwt', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Set secure flag in production
        sameSite: 'strict',
        maxAge: 3600000, // 1 hour in milliseconds
      });
    }
    return { verified: result.verified };
  }
}
