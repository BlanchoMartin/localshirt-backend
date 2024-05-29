import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Message {
  @Field(() => String, { nullable: true })
  msg?: string;

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
  content: Message;
}

@ObjectType()
export class User {
  @Field()
  id: number;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  name_company: string;
}
