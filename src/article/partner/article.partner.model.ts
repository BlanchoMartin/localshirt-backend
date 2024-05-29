import {Field, InputType, ObjectType, Int} from '@nestjs/graphql';

@ObjectType()
export class CriteriaObjectType {
    @Field()
    name: string
}

@ObjectType()
export class TransportObjectType {
    @Field()
    name: string

    @Field()
    percent: number
}

@InputType()
export class CriteriaInputType {
    @Field()
    name: string
}

@InputType()
export class TransportInputType {
    @Field()
    name: string

    @Field()
    percent: number
}

@ObjectType()
export class ArticlePartnerStruct {
    @Field()
    id: string;

    @Field()
    name: string;

    @Field()
    brand: string;

    @Field()
    email: string;

    @Field()
    redirection_url: string;

    @Field(type => [CriteriaObjectType])
    country: CriteriaObjectType[];

    @Field(type => [CriteriaObjectType])
    material: CriteriaObjectType[];

    @Field(type => [TransportObjectType])
    transport: TransportInputType[];

    @Field()
    image?: string;

    @Field()
    brandlogo: string;

    @Field()
    environnementdesc: string;

    @Field()
    ethicaldesc: string;

    @Field()
    branddesc: string;

    @Field()
    price: number;

    @Field(() => [Int])
    rgb: number[];

    @Field()
    ethical_score: number;

    @Field()
    ecological_score: number;

    @Field()
    local_score: number;

    @Field()
    type: string;

    @Field()
    lastbought: Date;

    @Field()
    lastshown: Date;

    @Field()
    lastclick: Date;

}

@ObjectType()
export class ArticlePartnerResponse {
  @Field()
  status: number;

  @Field()
  devMessage: string;

  @Field()
  userMessage: string;
}

@ObjectType()
export class ImageReturn {
  @Field()
  content: string;
}

@ObjectType()
export class ArticlePartnerListResponse {
  @Field()
  status: number;

  @Field()
  devMessage: string;

  @Field()
  userMessage?: string;

  @Field((type) => [ArticlePartnerStruct])
  articles: ArticlePartnerStruct[];
}
