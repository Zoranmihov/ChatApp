
import { Body, Controller, Get, Post, Request, UseGuards, } from '@nestjs/common';
import { UserService } from '../services/userService';
import { LocalStrategy, JwtAuthGuard } from '../services/authStrategy';
import { RegisterUserData } from './userDTO';
import { AuthGuard } from '@nestjs/passport';
@Controller()
export class UserController {
  constructor(private userService: UserService, private passportAuth: LocalStrategy) {}

  @Post('create-user')
  createUser(@Body() data: RegisterUserData) {
    const answer = this.userService.createUser(data)
    if(answer) {
      return data
    } else {
      return "Error"
    }
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  loginUser(@Request() req: any) {
   return this.passportAuth.login(req.user)
  }

  @UseGuards(JwtAuthGuard)
  @Get('protected')
  protectedRoute(@Request() req){
    return req.user;
  }
}
