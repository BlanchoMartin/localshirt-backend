import { Field, ObjectType } from '@nestjs/graphql';
import { Message } from 'src/auth/auth.model';

@ObjectType()
export class ScraperResponse {
  @Field()
  status: number;

  @Field()
  content: Message;
}
