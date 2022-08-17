import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from './userService';
import { JwtService } from '@nestjs/jwt';
import { ExtractJwt, Strategy as JStrategy } from 'passport-jwt';
import { AuthGuard } from '@nestjs/passport';
import { Request } from "express";



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
    const payload = { email: user.email, name: user.name, friends: user.friends, requests: user.friendRequests };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

@Injectable()
export class JwtStrategy extends PassportStrategy(JStrategy) {
  constructor(private jwtService: JwtService) {
    super({
      passReqToCallback:true,
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest:ExtractJwt.fromExtractors([(request:Request) => {
        const data = request?.cookies['jwt'];
        if(!data){
            return null;
        }
        return data.access_token
    }])
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email };
  }
}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}


