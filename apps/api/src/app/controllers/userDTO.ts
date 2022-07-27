import { IsEmail, IsNotEmpty } from 'class-validator';

export class RegisterUserData {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}


export class LoginUserData {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
