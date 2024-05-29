import { IsEmail, IsOptional, IsString } from 'class-validator';

export class LoginDTO {
  @IsEmail()
  email: string;
  @IsString()
  password: string;
}

export class UsersDTO {
  @IsEmail()
  email: string;
  @IsString()
  password: string;
  @IsString()
  name: string;
  @IsString()
  lastName: string;
  @IsString()
  businessRole: string;
  @IsString()
  businessContact: string;
  business_logo: Buffer;
  profil_picture: Buffer;
  @IsString()
  businessName: string;
  @IsOptional()
  confirmationToken: string;
  @IsOptional()
  isDevelopper: boolean;
  @IsString()
  businessDescription: string;
  @IsString()
  businessLink: string;
}
