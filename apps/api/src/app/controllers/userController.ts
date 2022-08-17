
import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../services/userService';
import { LocalStrategy, JwtAuthGuard } from '../services/authStrategy';
import { RegisterUserData } from './userDTO';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { Request as eRequest } from 'express';
import { LiveChat } from './chat.gateway';
@Controller('/user')
export class UserController {
  constructor(
    private userService: UserService,
    private passportAuth: LocalStrategy,
    private liveChat: LiveChat,
  ) {}

  @Post('create-user')
  createUser(@Body() data: RegisterUserData) {
    const answer = this.userService.createUser(data);
    if (answer) {
      return data;
    } else {
      return 'Error';
    }
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async loginUser(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    @Request() req: any,
    @Res({ passthrough: true }) res: Response
  ) {
    const jwt = await this.passportAuth.login(req.user);
    res.cookie('jwt', jwt, { httpOnly: true, maxAge: 3 * 24 * 60 * 60 * 1000 });
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req: eRequest) {
    const data = req?.cookies['jwt'];
    return this.userService.getProfile(data.access_token)

  }
  @UseGuards(JwtAuthGuard)
  @Get('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.cookie('jwt', "", { httpOnly: true, maxAge: 5 });
  }

  @Get('allUsers')
   getUsers(@Res({ passthrough: true }) res: Response) {
    return this.liveChat.getUsers()
  }
}
