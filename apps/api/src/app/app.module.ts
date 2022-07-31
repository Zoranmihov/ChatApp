import { Module } from '@nestjs/common';
import {UserController} from './controllers/userController'
import { UserService } from './services/userService';
import { LiveChat } from './controllers/chat.gateway';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy, JwtStrategy } from './services/authStrategy';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [PassportModule, JwtModule.register({
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: '3d' },
  }),],
  controllers: [UserController],
  providers: [UserService, LocalStrategy, JwtStrategy, LiveChat],
})
export class AppModule {}
