import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import {UserController} from './controllers/userController'
import { UserService } from './services/userService';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy, JwtStrategy } from './services/authStrategy';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [PassportModule, JwtModule.register({
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: '3d' },
  }),],
  controllers: [AppController, UserController],
  providers: [AppService, UserService, LocalStrategy, JwtStrategy],
})
export class AppModule {}
