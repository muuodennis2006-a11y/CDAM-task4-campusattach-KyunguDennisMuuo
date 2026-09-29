import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';

export enum RegisterRole {
  STUDENT = 'STUDENT',
  ORGANIZATION = 'ORGANIZATION',
}

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(RegisterRole)
  role: RegisterRole;
}
