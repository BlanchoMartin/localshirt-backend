import { Resolver, Args, Context, Query, Int, Mutation } from '@nestjs/graphql';
import { ArticlePartnerService } from './article.partner.service';
import { Req, UseGuards } from '@nestjs/common';
import {
  ArticlePartnerResponse,
  ArticlePartnerListResponse, TransportInputType,
} from './article.partner.model';
import {AdditionalCriteria} from "../../criteria/criteria.model";
import { CriteriaInputType } from './article.partner.model';

/**
 * Article Partner Resolver
 * 
 * @category Resolvers
 * @class
 * @classdesc Resolver for article partner queries
 */
@Resolver()
export class ArticlePartnerResolver {
  constructor(private articlePartnerService: ArticlePartnerService) {}

/**
 * Create Article Partner
 * 
 * @async
 * @returns {Promise<ArticlePartnerResponse>} A Promise of an Article Partner Response 
 */
  @Query((returns) => ArticlePartnerResponse)
  async createArticlePartner(
    @Args('name') name: string,
    @Args('redirection_url') redirection_url: string,
    @Args({name: 'material', type: () => [CriteriaInputType]}) material: CriteriaInputType[],
    @Args({name: 'country', type: () => [CriteriaInputType]}) country: CriteriaInputType[],
    @Args({name: 'transport', type: () => [TransportInputType]}) transport: TransportInputType[],
    @Args('price') price: number,
    @Args('image') image: string,
    @Args('description') description: string,
    @Args('environnementdesc') environnementdesc: string,
    @Args('ethicaldesc') ethicaldesc: string,
    @Args({name: 'additionalCriteria', type: () => [AdditionalCriteria]}) additionalCriteria: AdditionalCriteria[],
    @Context() context,
  ) {
    return this.articlePartnerService.create({ name,  redirection_url, country, material, transport, price, image, description, environnementdesc, ethicaldesc, additionalCriteria }, context.req);
  }

 /**
 * Delete Article Partner
 * 
 * @async
 * @returns {Promise<ArticlePartnerResponse>} A Promise of an Article Partner Response 
 */
  @Query((returns) => ArticlePartnerResponse)
  async deleteArticlePartner(@Args('id') id: string, @Context() context) {
    return this.articlePartnerService.delete(id, context.req);
  }

  @Query((returns) => ArticlePartnerResponse)
  async updateArticlePartner(
    @Args('id') id: string,
    @Args('name') name: string,
    @Args('country') country: string,
    @Args('material') material: string,
    @Args('transport') transport: string,
    @Args('price') price: string,
    @Args('image') image: string,
    @Args('brandlogo') brandlogo: string,
    @Args('description') description: string,
    @Args('branddesc') branddesc: string,
    @Args('environnementdesc') environnementdesc: string,
    @Args('ethicaldesc') ethicaldesc: string,
    @Args('type') type: string,
    @Args('lastbought') lastbought: Date,
    @Args('lastshown') lastshown: Date,
    @Args('lastclick') lastclick: Date,
    @Context() context,
  ) {
    return this.articlePartnerService.update(id, { name, country, material, transport, price, image, brandlogo, description, branddesc, environnementdesc, ethicaldesc, type, lastbought, lastshown, lastclick, isAdmin: false }, context.req);
  }


  @Mutation((returns) => ArticlePartnerResponse)
  async updateArticlePartnerAdmin(
    @Args('id') id: string,
    @Args('name') name: string,
    @Args('brand') brand: string,
    @Args('country') country: string,
    @Args('material') material: string,
    @Args('transport') transport: string,
    @Args('price') price: string,
    @Args('brandlogo') brandlogo: string,
    @Args('description') description: string,
    @Args('branddesc') branddesc: string,
    @Args('environnementdesc') environnementdesc: string,
    @Args('ethicaldesc') ethicaldesc: string,
    @Args('type') type: string,
    @Args('lastbought') lastbought: String,
    @Args('lastshown') lastshown: String,
    @Args('lastclick') lastclick: String,
    @Context() context,
  ) {
    return this.articlePartnerService.update(id, { 
      name: name, 
      brand: brand, 
      country: country, 
      material: material, 
      transport: transport, 
      price: price, 
      brandlogo: brandlogo, 
      description: description, 
      branddesc: branddesc, 
      environnementdesc: environnementdesc, 
      ethicaldesc: ethicaldesc, type: type, lastbought: lastbought, 
      lastshown: lastshown, lastclick: lastclick, isAdmin: true }, context.req);
  }

 /**
 * Get Article Partner List
 * 
 * @async
 * @returns {Promise<ArticlePartnerResponse>} An array with the articles
 */
  @Query((returns) => ArticlePartnerListResponse)
  async getArticlePartnerList(
    @Args('name', { defaultValue: null }) name: string,
    @Args('brand', { defaultValue: null }) brand: string,
    @Args('country', { defaultValue: null }) country: string,
    @Args('material', { defaultValue: null }) material: string,
    @Args('transport', { defaultValue: null }) transport: string,
    @Args('price', { defaultValue: null }) price: string,
    @Args('ethical_score', { defaultValue: null }) ethical_score: string,
    @Args('ecological_score', { defaultValue: null }) ecological_score: string,
    @Args('local_score', { defaultValue: null }) local_score: string,
    @Args('type', { defaultValue: null }) type: string,
    @Args('lastbought', { defaultValue: null }) lastbought: Date,
    @Args('lastshown', { defaultValue: null }) lastshown: Date,
    @Args('lastclick', { defaultValue: null }) lastclick: Date,
    @Context() context,
  ) {
    return this.articlePartnerService.getArticlePartnerList({
      name,
      brand,
      country,
      material,
      transport,
      price,
      ethical_score,
      ecological_score,
      local_score,
      type,
      lastbought,
      lastshown,
      lastclick
    }, context.req);
  }

  @Query((returns) => ArticlePartnerListResponse)
  async getArticlePartnerUserList(@Context() context) {
    return this.articlePartnerService.getArticlesByUserId(context.req);
  }

  @Query((returns) => ArticlePartnerListResponse)
  async getAllArticlesPartner(
    @Context() context,
  ) {
    return this.articlePartnerService.getAllArticlesPartner();
  }

  @Query((returns) => ArticlePartnerResponse)
  async updateArticleLastClick(@Context() context, @Args('id') articleId: string) {
    return this.articlePartnerService.updateArticleLastClick(articleId);
  }
}
