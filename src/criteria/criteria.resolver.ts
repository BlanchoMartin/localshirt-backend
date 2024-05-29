import {Resolver, Args, Context, Query, InputType, Field, Mutation} from '@nestjs/graphql';
import { CriteriaService } from './criteria.service';
import { Req, UseGuards } from '@nestjs/common';
import {Question} from "../question/question.model";
import {AdditionalCriteria, CriteriaListResponse, CriteriaResponse} from "./criteria.model";
import {ArticlePartnerListResponse} from "../article/partner/article.partner.model";
import {Criteria} from "../database/entities/criteria.entity";

@Resolver()
export class CriteriaResolver {
  constructor(private criteriaService: CriteriaService) {}

  @Query((returns) => CriteriaResponse)
  async createCriteria(
    @Args('tag') tag: string,
    @Args('type') type: string,
    @Args({name: 'additionalCriteria', type: () => [AdditionalCriteria]}) additionalCriteria: AdditionalCriteria[],
    @Context() context,
  ) {
    return this.criteriaService.create({ tag, type, additionalCriteria }, context.req);
  }

  @Query((returns) => CriteriaResponse)
  async deleteCriteria(
    @Args('id') id: string,
    @Context() context,
  ) {
    return this.criteriaService.delete(id, context.req);
  }

  @Query((returns) => CriteriaResponse)
  async updateCriteria(
    @Args('id') id: string,
    @Args('tag') tag: string,
    @Args('production') production: boolean,
    @Args('end_life') end_life: boolean,
    @Args('independent_chemical') independent_chemical: boolean,
    @Args('natural') natural: boolean,
    @Args('life_duration') life_duration: number,
    @Args('life_cycle') life_cycle: boolean,
    @Args('animals') animals: boolean,
    @Context() context,
  ) {
    return this.criteriaService.update(id, { tag, production, end_life, independent_chemical, natural, life_duration, life_cycle, animals }, context.req);
  }

  @Query((returns) => CriteriaListResponse)
  async getAllCriteria(
      @Context() context,
  ) {
    return this.criteriaService.getAllCriteria();
  }
}
