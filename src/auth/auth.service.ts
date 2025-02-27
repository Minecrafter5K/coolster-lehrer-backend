import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import { drizzle, MySql2Database } from 'drizzle-orm/mysql2';
import { eq } from 'drizzle-orm';
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
} from '@simplewebauthn/server';
import { v4 as uuidv4 } from 'uuid';
import { userTable, passkeyTable } from '../db/schema';

@Injectable()
export class AuthService {
  db: MySql2Database;
  private jwtSecret = process.env.JWT_SECRET || 'your-secret-key';

  constructor(@Inject('DATABASE_URL') database_url: string) {
    if (!database_url) throw new Error('no database url');
    this.db = drizzle(database_url);
    // Seed-User nur falls benötigt; alternativ per DB-Migration ein initialer Datensatz
    // await this.db.insert(userTable).values({ id: 'internalUserId', username: 'user@example.com', credentials: '' });
  }

  // Registrierungsoptionen: Hole vorhandene Passkeys aus passkeyTable (statt aus user.credentials)
  async generateRegistrationOptions({
    userId,
    username,
  }: {
    userId?: string;
    username?: string;
  }) {
    let user: typeof userTable.$inferSelect | undefined;
    if (userId) {
      const userResult = await this.db
        .select()
        .from(userTable)
        .where(eq(userTable.id, userId))
        .limit(1);
      user = userResult[0];
    }
    if (!user) {
      if (!username) {
        throw new BadRequestException(
          'Username is required for new registration',
        );
      }
      userId = uuidv4();
      await this.db.insert(userTable).values({
        id: userId,
        username,
        currentChallenge: '',
      });
      user = { id: userId, username, currentChallenge: '' };
    }
    // Abfrage aller registrierten Passkeys für diesen User
    const passkeys = await this.db
      .select()
      .from(passkeyTable)
      .where(eq(passkeyTable.user_id, userId!));

    const opts: GenerateRegistrationOptionsOpts = {
      rpName: 'Coolster Lehrer',
      rpID: process.env.RP_ID || 'localhost',
      userName: user.username,
      timeout: 60000,
      attestationType: 'none',
      excludeCredentials: passkeys.map((pk) => ({
        id: pk.cred_id,
        type: 'public-key',
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        transports: JSON.parse(pk.transports),
      })),
      authenticatorSelection: {
        residentKey: 'discouraged',
        userVerification: 'preferred',
      },
      supportedAlgorithmIDs: [-7, -257],
    };

    const options = await generateRegistrationOpts(opts);
    await this.db
      .update(userTable)
      .set({ currentChallenge: options.challenge })
      .where(eq(userTable.id, userId!));
    return { opts: options, userId };
  }

  // Nach erfolgreicher Registrierung: Speichere den Passkey in der passkeyTable
  async verifyRegistrationResponse(
    userId: string,
    body: RegistrationResponseJSON,
  ) {
    const userResult = await this.db
      .select()
      .from(userTable)
      .where(eq(userTable.id, userId))
      .limit(1);
    const user = userResult[0];
    if (!user || !user.currentChallenge) {
      throw new BadRequestException('No challenge found for the user');
    }

    const opts: VerifyRegistrationResponseOpts = {
      response: body,
      expectedChallenge: `${user.currentChallenge}`,
      expectedOrigin: process.env.FRONTEND_URL || 'http://localhost:5173',
      expectedRPID: process.env.RP_ID || 'localhost',
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
      // Prüfe, ob der Passkey bereits existiert
      const existing = await this.db
        .select()
        .from(passkeyTable)
        .where(eq(passkeyTable.cred_id, credential.id))
        .limit(1);
      if (existing.length === 0) {
        await this.db.insert(passkeyTable).values({
          cred_id: credential.id,
          cred_public_key: credential.publicKey,
          user_id: userId,
          webauthn_user_id: user.id, // kann angepasst werden, falls anders benötigt
          counter: credential.counter,
          backup_eligible: false,
          backup_status: false,
          transports: JSON.stringify(body.response.transports),
          created_at: new Date(),
          last_used: new Date(),
        });
      }
    }

    await this.db
      .update(userTable)
      .set({ currentChallenge: null })
      .where(eq(userTable.id, userId));
    const jwt = sign(
      { userId: user.id, username: user.username },
      this.jwtSecret,
      { expiresIn: '1h' },
    );
    return { verification, token: jwt };
  }

  // Authentifizierungsoptionen: Hole Passkeys aus passkeyTable
  async generateAuthenticationOptions({
    userId,
    username,
  }: {
    userId?: string;
    username?: string;
  }) {
    let user: typeof userTable.$inferSelect | undefined;
    if (!userId && username) {
      const userResult = await this.db
        .select()
        .from(userTable)
        .where(eq(userTable.username, username))
        .limit(1);
      user = userResult[0];
      if (!user) {
        throw new BadRequestException(
          'User not found for the provided username',
        );
      }
      userId = user.id;
    } else if (userId) {
      const userResult = await this.db
        .select()
        .from(userTable)
        .where(eq(userTable.id, userId))
        .limit(1);
      user = userResult[0];
    } else {
      throw new BadRequestException('Either userId or username is required');
    }

    if (!user) {
      throw new BadRequestException('User not found');
    }
    // Lesen der Passkeys aus passkeyTable
    const passkeys = await this.db
      .select()
      .from(passkeyTable)
      .where(eq(passkeyTable.user_id, userId));
    const opts: GenerateAuthenticationOptionsOpts = {
      timeout: 60000,
      allowCredentials: passkeys.map((pk) => ({
        id: pk.cred_id,
        type: 'public-key',
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        transports: JSON.parse(pk.transports),
      })),
      userVerification: 'preferred',
      rpID: process.env.RP_ID || 'localhost',
    };

    const options = await generateAuthenticationOpts(opts);
    await this.db
      .update(userTable)
      .set({ currentChallenge: options.challenge })
      .where(eq(userTable.id, userId));
    return { opts: options, userId };
  }

  // Verifiziere die Authentifizierungsantwort und aktualisiere den Passkey-Counter in der passkeyTable
  async verifyAuthenticationResponse(
    userId: string,
    body: AuthenticationResponseJSON,
  ) {
    const userResult = await this.db
      .select()
      .from(userTable)
      .where(eq(userTable.id, userId))
      .limit(1);
    const user = userResult[0];

    if (!user || !user.currentChallenge) {
      throw new BadRequestException('No challenge found for the user');
    }
    const passkeys = await this.db
      .select()
      .from(passkeyTable)
      .where(eq(passkeyTable.user_id, userId));
    const dbPasskey = passkeys.find((pk) => pk.cred_id === body.id);
    if (!dbPasskey) {
      throw new BadRequestException(
        'Authenticator is not registered with this site',
      );
    }

    const opts: VerifyAuthenticationResponseOpts = {
      response: body,
      expectedChallenge: `${user.currentChallenge}`,
      expectedOrigin: process.env.FRONTEND_URL || 'http://localhost:5173',
      expectedRPID: process.env.RP_ID || 'localhost',
      credential: {
        id: dbPasskey.cred_id,
        publicKey: dbPasskey.cred_public_key,
        counter: dbPasskey.counter,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        transports: JSON.parse(dbPasskey.transports),
      },
      requireUserVerification: false,
    };

    let verification: VerifiedAuthenticationResponse;
    try {
      verification = await verifyAuthenticationRes(opts);
    } catch (err) {
      throw new BadRequestException((err as Error).message);
    }

    if (verification.verified) {
      // Aktualisiere den Counter und last_used im passkeyTable
      await this.db
        .update(passkeyTable)
        .set({
          counter: verification.authenticationInfo.newCounter,
          last_used: new Date(),
        })
        .where(eq(passkeyTable.cred_id, dbPasskey.cred_id));
    }

    await this.db
      .update(userTable)
      .set({ currentChallenge: null })
      .where(eq(userTable.id, userId));
    const jwt = sign(
      { userId: user.id, username: user.username },
      this.jwtSecret,
      { expiresIn: '1h' },
    );

    return { verified: verification.verified, token: jwt };
  }
}
