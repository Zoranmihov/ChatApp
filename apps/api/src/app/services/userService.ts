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
    const user: any = await User.findOne({ email: decoded.email });
    const profile = {
      email: decoded.email,
      name: decoded.name,
      friends: user.friends,
      requests: user.friendRequests
    };
    return profile
  }

  async request(email: string, name: string, senderEmail: string) {
    const user: any = await User.findOne({ email: email });
    const requests = user.friendRequests;
    requests.push({fromName: name, fromEmail: senderEmail})
    await User.findOneAndUpdate({email: email}, {friendRequests: requests}, {new: true})
    return requests
  }
  async respondTorequest(responseUser, requestUser, status) {
    const responseUser = await User.findOne({ email: responseUser })
    const requestUserEmail = requestUser;
    if(status === 'Accept') {
      const requestUser = await User.findOne({ email: requestUserEmail })
      // Add in responseUser friends list
    } else {

    }
  }
}

