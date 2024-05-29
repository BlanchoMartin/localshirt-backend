import { Resolver, Args, Context, Query, Field } from '@nestjs/graphql';
import { QuestionService } from './question.service';
import { Question, QuestionResponse } from './question.model';
import {contents} from "cheerio/lib/api/traversing";

@Resolver('Question')
export class QuestionResolver {
  constructor(private questionService: QuestionService) {}

    @Query((returns) => QuestionResponse)
    async createQuestion(
        @Args('tag') tag: string,
        @Args('content') content: string,
        @Args('criteria_target') criteria_target: string,
        @Args('criteria_application') criteria_application: string,
        @Args('user_response_type') user_response_type: string,
        @Args('factor') factor: number,
        @Args('minimize') minimize: boolean,
        @Context() context,
    ) {
        return this.questionService.create({ tag, content, criteria_target, criteria_application, user_response_type, factor, minimize }, context.req);
    }

    @Query((returns) => QuestionResponse)
    async updateQuestionById(
        @Args('id') id: string,
        @Args('tag', {defaultValue: null}) tag: string,
        @Args('content', {defaultValue: null}) content: string,
        @Args('criteria_target', {defaultValue: null}) criteria_target: string,
        @Args('criteria_application', {defaultValue: null}) criteria_application: string,
        @Args('user_response_type', {defaultValue: null}) user_response_type: string,
        @Args('factor', {defaultValue: null}) factor: number,
        @Args('minimize', {defaultValue: null}) minimize: boolean,
        @Context() context,
    ) {
        return this.questionService.updateById({ id, tag, content, criteria_target, criteria_application, user_response_type, factor, minimize }, context.req);
    }

    @Query((returns) => QuestionResponse)
    async updateQuestionByTag(
        @Args('tag') tag: string,
        @Args('content', {defaultValue: null}) content: string,
        @Args('criteria_target', {defaultValue: null}) criteria_target: string,
        @Args('criteria_application', {defaultValue: null}) criteria_application: string,
        @Args('user_response_type', {defaultValue: null}) user_response_type: string,
        @Args('factor', {defaultValue: null}) factor: number,
        @Args('minimize', {defaultValue: null}) minimize: boolean,
        @Context() context,
    ) {
        return this.questionService.updateByTag({ tag, content, criteria_target, criteria_application, user_response_type, factor, minimize }, context.req);
    }

  @Query((returns) => QuestionResponse)
  async deleteQuestion(
      @Args('id') id: string,
  @Context() context,
  ) {
    return this.questionService.deleteById(id, context.req);
  }

  @Query((returns) => QuestionResponse)
  async getQuestionByTag(
      @Args('tag') tag: string,
      @Context() context,
  ) {
    return this.questionService.getByTag(tag, context.req);
  }

  @Query((returns) => [Question])
  async getAllQuestions(
      @Context() context,
  ): Promise<Question[]> {
    const questions = await this.questionService.getAll(context.req);

    return questions.map((question) => ({
      ...question,
    }));
  }
}
