import { IsEmail, IsString, MinLength } from 'class-validator'

export type CreateUserDto = {
  name: string;
  email: string;
  password: string
};