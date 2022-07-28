import { Injectable } from '@nestjs/common';
import { RegisterUserData } from '../controllers/userDTO';

import User from '../models/userModel';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(private jwtService: JwtService){}
  async createUser(data: RegisterUserData) {
    const salt = await bcrypt.genSalt();
    data.name = data.name[0].toUpperCase() + data.name.substring(1);
    data.password = await bcrypt.hash(data.password, salt);
    const user = await User.create(data);
    if (user) {
      return true;
    }
    false;
  }

  async validateUser(email: string, password: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user: any = await User.findOne({ email: email });
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        return user;
      } else {
        return null;
      }
    }
    return null;
  }
  async getProfile(access_token){
    const decoded = await this.jwtService.verifyAsync(access_token)
    const profile = {
      email: decoded.email,
      name: decoded.name
    };
    return profile
  }
}

