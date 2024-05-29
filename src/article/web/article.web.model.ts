import {Field, InputType, ObjectType} from '@nestjs/graphql';
import { Message } from 'src/auth/auth.model';
import { Column } from 'typeorm';

@ObjectType()
export class ArticleWebResponse {
  @Field()
  status: number;

  @Field()
  devMessage: string;

  @Field()
  userMessage?: string;
}


@InputType()
export class CountryInput {
  @Field()
  name: string;
}

@InputType()
export class MaterialInput {
  @Field()
  name: string;

  @Field()
  percent: number;
}

@InputType()
export class TransportInput {
  @Field()
  name: string;

  @Field()
  percent: number;
}

@ObjectType()
class CountryObject {
  @Field()
  name: string;
}

@ObjectType()
class MaterialObject {
  @Field()
  name: string;

  @Field()
  percent: number;
}

@ObjectType()
class TransportObject {
  @Field()
  name: string;

  @Field()
  percent: number;
}

@ObjectType()
export class ArticleWebObject {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  url: string;

  @Field()
  image: string;

  @Field()
  brand: string;

  @Field()
  price: number;

  @Field(() => [CountryObject])
  country: CountryObject[];

  @Field(() => [MaterialObject])
  material: MaterialObject[];

  @Field(() => [TransportObject])
  transport: TransportObject[];

  @Field()
  ethical_score: number;

  @Field()
  ecological_score: number;

  @Field()
  local_score: number;
}
