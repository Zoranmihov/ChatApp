import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from './userService';
import { JwtService } from '@nestjs/jwt';
import { ExtractJwt, Strategy as JStrategy } from 'passport-jwt';
import { AuthGuard } from '@nestjs/passport';



@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService, private jwtService: JwtService) {
    super({ usernameField: 'email' });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async validate(email: string, password: string): Promise<any> {
    const user = await this.userService.validateUser(email, password)
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async login(user: any) {
    const payload = { email: user.email, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

@Injectable()
export class JwtStrategy extends PassportStrategy(JStrategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: "YouSawNothing",
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email };
  }
}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}


