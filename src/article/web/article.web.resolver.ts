import {Args, Field, Int, Query, Resolver} from '@nestjs/graphql';
import { ArticleWebService } from './article.web.service';
import {
  ArticleWebObject,
  ArticleWebResponse,
  CountryInput, MaterialInput,
  TransportInput
} from './article.web.model';
import {ArticleWeb} from "../../database/entities/article.web.entity";

@Resolver('ArticleWeb')
export class ArticleWebResolver {
  constructor(private articleWebService: ArticleWebService) {}

  @Query((returns) => ArticleWebResponse)
  async createArticleWeb(
    @Args('name') name: string,
    @Args('url') url: string,
    @Args('brand') brand: string,
    @Args({name: 'country', type: () => [CountryInput]}) country: CountryInput[],
    @Args({name: 'material', type: () => [MaterialInput]}) material: MaterialInput[],
    @Args({name: 'transport', type: () => [TransportInput]}) transport: TransportInput[],
    @Args('price') price: number,
    @Args('image') image: string,
  ): Promise<ArticleWebResponse> {
    return this.articleWebService.create({
      name,
      url,
      brand,
      country,
      material,
      transport,
      price,
      image
    });
  }

  @Query((returns) => ArticleWebResponse)
  async updateArticleWebById(
      @Args('id') id: string,
      @Args('name', {defaultValue: null, nullable: true}) name: string,
      @Args('url', {defaultValue: null, nullable: true}) url: string,
      @Args('brand', {defaultValue: null, nullable: true}) brand: string,
      @Args({name: 'country', type: () => [CountryInput], defaultValue: null, nullable: true}) country: CountryInput[],
      @Args({name: 'material', type: () => [MaterialInput], defaultValue: null, nullable: true}) material: MaterialInput[],
      @Args({name: 'transport', type: () => [TransportInput], defaultValue: null, nullable: true}) transport: TransportInput[],
      @Args('price', {defaultValue: null, nullable: true}) price: number,
      @Args('image', {defaultValue: null, nullable: true}) image: string,
  ): Promise<ArticleWebResponse> {
    return this.articleWebService.updateById({
      id,
      name,
      url,
      brand,
      country,
      material,
      transport,
      price,
      image
    });
  }

  @Query((returns) => ArticleWebResponse)
  async deleteArticleWebById(@Args('id') id: string) {
    return this.articleWebService.deleteById(id);
  }

  @Query((returns) => ArticleWebObject)
  async isArticleUrlAlreadyParsed(@Args('url') url: string): Promise<ArticleWeb> {
    return this.articleWebService.isArticleUrlAlreadyParsed(url);
  }
}
