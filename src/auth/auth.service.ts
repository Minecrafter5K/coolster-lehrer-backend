import { Injectable, BadRequestException } from '@nestjs/common';
import {
  generateRegistrationOptions as generateRegistrationOpts,
  verifyRegistrationResponse as verifyRegistrationRes,
  generateAuthenticationOptions as generateAuthenticationOpts,
  verifyAuthenticationResponse as verifyAuthenticationRes,
  GenerateRegistrationOptionsOpts,
  VerifyRegistrationResponseOpts,
  GenerateAuthenticationOptionsOpts,
  VerifyAuthenticationResponseOpts,
  RegistrationResponseJSON,
  AuthenticationResponseJSON,
  VerifiedRegistrationResponse,
  VerifiedAuthenticationResponse,
  WebAuthnCredential,
} from '@simplewebauthn/server';

// In a real application these would be stored in a database or session store.
interface User {
  id: string;
  username: string;
  credentials: WebAuthnCredential[];
  currentChallenge?: string;
}

@Injectable()
export class AuthService {
  // A simple in-memory user "database"
  private users: Map<string, User> = new Map();

  constructor() {
    // For demonstration, seed a single user.
    const userId = 'internalUserId';
    this.users.set(userId, {
      id: userId,
      username: 'user@example.com',
      credentials: [],
    });
  }

  /**
   * Generate registration options.
   * In a real-world app you should bind the challenge to the user session.
   */
  async generateRegistrationOptions(userId: string) {
    const user = this.users.get(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const opts: GenerateRegistrationOptionsOpts = {
      rpName: 'SimpleWebAuthn Example',
      rpID: 'localhost', // Adjust for your domain
      userName: user.username,
      timeout: 60000,
      attestationType: 'none',
      // Prevent re-registration of the same authenticator
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
    // Save challenge with the user so it can be retrieved during verification
    user.currentChallenge = options.challenge;
    // In production, you might store this in a session or a persistent DB
    return options;
  }

  /**
   * Verify registration response.
   */
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
      // expectedOrigin would normally be determined by your environment (e.g. 'http://localhost:8000')
      expectedOrigin: 'http://localhost:5173',
      expectedRPID: 'localhost', // Adjust as needed
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
      // Add the new credential if it's not already registered
      if (!user.credentials.find((cred) => cred.id === credential.id)) {
        const newCredential: WebAuthnCredential = {
          id: credential.id,
          publicKey: credential.publicKey,
          counter: credential.counter,
          // In a real-world setup, the transports information should come from response
          transports: body.response.transports,
        };
        user.credentials.push(newCredential);
      }
    }

    // Clear the challenge after verification
    user.currentChallenge = undefined;
    return verification;
  }

  /**
   * Generate authentication options.
   */
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
      rpID: 'localhost', // Adjust for your domain
    };

    const options = await generateAuthenticationOpts(opts);
    // Save the challenge to verify later
    user.currentChallenge = options.challenge;
    return options;
  }

  /**
   * Verify authentication response.
   */
  async verifyAuthenticationResponse(
    userId: string,
    body: AuthenticationResponseJSON,
  ) {
    const user = this.users.get(userId);
    if (!user || !user.currentChallenge) {
      throw new BadRequestException('No challenge found for the user');
    }

    // Retrieve the credential used for the authentication
    const dbCredential = user.credentials.find((cred) => cred.id === body.id);
    if (!dbCredential) {
      throw new BadRequestException(
        'Authenticator is not registered with this site',
      );
    }

    const opts: VerifyAuthenticationResponseOpts = {
      response: body,
      expectedChallenge: `${user.currentChallenge}`,
      expectedOrigin: 'http://localhost:5173', // Adjust to your expected origin
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
      // Update the counter to avoid replay attacks
      dbCredential.counter = verification.authenticationInfo.newCounter;
    }

    user.currentChallenge = undefined;
    return verification;
  }
}
