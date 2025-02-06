import { Injectable, BadRequestException } from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import {
  generateRegistrationOptions as generateRegistrationOpts,
  verifyRegistrationResponse as verifyRegistrationRes,
  generateAuthenticationOptions as generateAuthenticationOpts,
  verifyAuthenticationResponse as verifyAuthenticationRes,
  GenerateRegistrationOptionsOpts,
  GenerateAuthenticationOptionsOpts,
  VerifyRegistrationResponseOpts,
  VerifyAuthenticationResponseOpts,
  RegistrationResponseJSON,
  AuthenticationResponseJSON,
  VerifiedRegistrationResponse,
  VerifiedAuthenticationResponse,
  WebAuthnCredential,
} from '@simplewebauthn/server';

interface User {
  id: string;
  username: string;
  credentials: WebAuthnCredential[];
  currentChallenge?: string;
}

@Injectable()
export class AuthService {
  // In-memory user "database". Replace with your persistent storage in production.
  private users: Map<string, User> = new Map();

  private jwtSecret = process.env.JWT_SECRET || 'your-secret-key';

  constructor() {
    // Seed a user for demonstration
    const userId = 'internalUserId';
    this.users.set(userId, {
      id: userId,
      username: 'user@example.com',
      credentials: [],
    });
  }

  async generateRegistrationOptions(userId: string) {
    const user = this.users.get(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const opts: GenerateRegistrationOptionsOpts = {
      rpName: 'SimpleWebAuthn Example',
      rpID: 'localhost',
      userName: user.username,
      timeout: 60000,
      attestationType: 'none',
      excludeCredentials: user.credentials.map((cred) => ({
        id: cred.id,
        type: 'public-key',
        transports: cred.transports,
      })),
      authenticatorSelection: {
        residentKey: 'preferred',
        userVerification: 'preferred',
      },
      supportedAlgorithmIDs: [-7, -257],
    };

    const options = await generateRegistrationOpts(opts);
    user.currentChallenge = options.challenge;
    return options;
  }

  async verifyRegistrationResponse(
    userId: string,
    body: RegistrationResponseJSON,
  ) {
    const user = this.users.get(userId);
    if (!user || !user.currentChallenge) {
      throw new BadRequestException('No challenge found for the user');
    }

    const opts: VerifyRegistrationResponseOpts = {
      response: body,
      expectedChallenge: `${user.currentChallenge}`,
      expectedOrigin: 'http://localhost:5173',
      expectedRPID: 'localhost',
      requireUserVerification: false,
    };

    let verification: VerifiedRegistrationResponse;
    try {
      verification = await verifyRegistrationRes(opts);
    } catch (err) {
      throw new BadRequestException((err as Error).message);
    }

    if (verification.verified && verification.registrationInfo) {
      const { credential } = verification.registrationInfo;
      if (!user.credentials.find((cred) => cred.id === credential.id)) {
        const newCredential: WebAuthnCredential = {
          id: credential.id,
          publicKey: credential.publicKey,
          counter: credential.counter,
          transports: body.response.transports,
        };
        user.credentials.push(newCredential);
      }
    }

    user.currentChallenge = undefined;

    const jwt = sign(
      { userId: user.id, username: user.username },
      this.jwtSecret,
      { expiresIn: '1h' },
    );
    return { verification, token: jwt };
  }

  async generateAuthenticationOptions(userId: string) {
    const user = this.users.get(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const opts: GenerateAuthenticationOptionsOpts = {
      timeout: 60000,
      allowCredentials: user.credentials.map((cred) => ({
        id: cred.id,
        type: 'public-key',
        transports: cred.transports,
      })),
      userVerification: 'preferred',
      rpID: 'localhost',
    };

    const options = await generateAuthenticationOpts(opts);
    user.currentChallenge = options.challenge;
    return options;
  }

  async verifyAuthenticationResponse(
    userId: string,
    body: AuthenticationResponseJSON,
  ) {
    const user = this.users.get(userId);
    if (!user || !user.currentChallenge) {
      throw new BadRequestException('No challenge found for the user');
    }

    const dbCredential = user.credentials.find((cred) => cred.id === body.id);
    if (!dbCredential) {
      throw new BadRequestException(
        'Authenticator is not registered with this site',
      );
    }

    const opts: VerifyAuthenticationResponseOpts = {
      response: body,
      expectedChallenge: `${user.currentChallenge}`,
      expectedOrigin: 'http://localhost:5173',
      expectedRPID: 'localhost',
      credential: dbCredential,
      requireUserVerification: false,
    };

    let verification: VerifiedAuthenticationResponse;
    try {
      verification = await verifyAuthenticationRes(opts);
    } catch (err) {
      throw new BadRequestException((err as Error).message);
    }

    if (verification.verified) {
      dbCredential.counter = verification.authenticationInfo.newCounter;
    }

    user.currentChallenge = undefined;
    const jwt = sign(
      { userId: user.id, username: user.username },
      this.jwtSecret,
      { expiresIn: '1h' },
    );
    return { verified: verification.verified, token: jwt };
  }
}
