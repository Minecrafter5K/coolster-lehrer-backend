import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

type JwtPayload = {
  userId: string;
  username: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // Extract token from cookies. The cookie-parser middleware must be applied first.
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          console.log('JWT Strategy, req:', req.cookies);
          let token: string | null = null;
          if (req && req.cookies && typeof req.cookies['jwt'] === 'string') {
            token = req.cookies['jwt'];
          }
          return token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'your-secret-key',
    });
  }

  validate(payload: JwtPayload) {
    return { userId: payload.userId, username: payload.username };
  }
}
