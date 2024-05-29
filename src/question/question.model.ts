import {Field, InputType, ObjectType} from '@nestjs/graphql';

@ObjectType()
export class QuestionResponse {
  @Field()
  status: number;

  @Field()
  devMessage: string;
}

@ObjectType()
export class Question {
    @Field()
    id: string;

    @Field()
    tag: string;

    @Field()
    content: string;

    @Field()
    criteria_target: string;

    @Field()
    criteria_application: string;

    @Field()
    user_response_type: string;

    @Field()
    factor: number;

    @Field()
    minimize: boolean;
}

@InputType()
export class InputQuestion {
    @Field()
    questionId: string;

    @Field()
    criteria_application: string;

    @Field()
    user_response_type: string;

    @Field()
    factor: number;

    @Field()
    minimize: boolean;
}
