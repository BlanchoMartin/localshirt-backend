import {Field, InputType, ObjectType} from '@nestjs/graphql';
import {InputQuestion, Question} from "../question/question.model";
import * as stream from "stream";
import {ArticlePartnerStruct} from "../article/partner/article.partner.model";
import {Criteria} from "../database/entities/criteria.entity";
import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@ObjectType()
export class CriteriaResponse {
  @Field()
  status: number;

  @Field()
  devMessage: string;
}

@ObjectType()
export class CriteriaStruct {
  @Field()
  id: string;

  @Field()
  tag: string;

  @Field()
  type: string;

  @Field()
  ethical_score: number;

  @Field()
  ecological_score: number;

  @Field()
  local_score: number;
}

@ObjectType()
export class CriteriaListResponse {
  @Field()
  status: number;

  @Field()
  devMessage: string;

  @Field(type => [CriteriaStruct])
  criteria: CriteriaStruct[];
}

@InputType()
export class AdditionalCriteria {
  @Field()
  result: string;

  @Field()
  question: InputQuestion;
}