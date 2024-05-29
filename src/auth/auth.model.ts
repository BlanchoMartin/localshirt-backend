import { Field, ObjectType } from '@nestjs/graphql';
import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {ArticlePartnerStruct} from "../article/partner/article.partner.model";

@ObjectType()
export class Message {
  @Field(() => String, { nullable: true })
  email?: string;

  @Field(() => String, { nullable: true })
  access_token?: string;
}

@ObjectType()
export class AuthResponse {
  @Field()
  status: number;

  @Field()
  devMessage: string;

  @Field({ nullable: true })
  userMessage?: string;

  @Field({ nullable: true })
  content?: Message;
}

@ObjectType()
export class Company {
  @Field()
  name: string;

  @Field()
  logo: string;

  @Field()
  description: string;

  @Field()
  businessLink: string;
}

@ObjectType()
export class CompaniesListResponse {
  @Field()
  status: number;

  @Field()
  content: string;

  @Field((type) => [Company])
  companies: Company[];
}

@ObjectType()
export class User {
  @Field()
  id: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  name: string;

  @Field()
  lastName: string;

  @Field({ nullable: true })
  businessRole: string;

  @Field({ nullable: true })
  businessContact: string;

  @Field({ nullable: true })
  businessName: string;

  @Field({ nullable: true })
  businessAdress: string;

  @Field({ nullable: true })
  businessZipCode: string;

  @Field({ nullable: true })
  businessCity: string;

  @Field({ nullable: true })
  businessCountry: string;

  @Field({ nullable: true })
  businessDescription: string;

  @Field({ nullable: true })
  isConfirmed: boolean;

  @Field({ nullable: true })
  isDeveloper: boolean;
  
  @Field()
  business_logo: string;

  @Field()
  profil_picture: string;
}


@ObjectType()
export class UserAuthResponse {
  @Field()
  status: number;

  @Field()
  devMessage: string;

  @Field({ nullable: true })
  userMessage?: string;

  @Field({ nullable: true })
  user?: User;
}

@ObjectType()
export class UserListResponse {
  @Field()
  status: number;

  @Field(() => [User])
  users: User[];
}
