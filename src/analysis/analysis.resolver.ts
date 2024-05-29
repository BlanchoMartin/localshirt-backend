import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { AnalysisService } from './analysis.service';
import { ArticlePartnerListResponse } from '../article/partner/article.partner.model';

@Resolver()
export class AnalysisResolver {
  constructor(private AnalysisService: AnalysisService,
    ) {}

  @Query((returns) => ArticlePartnerListResponse)
  async findAlternative(
    @Args('URL') URL: string,
    @Args('likeliness') likeliness: number,
    @Args('minPrice') minPrice: number,
    @Args('maxPrice') maxPrice: number,
    ): Promise<ArticlePartnerListResponse> {
    return await this.AnalysisService.findAlternative(URL, likeliness, minPrice, maxPrice);
  }

  @Mutation(() => ArticlePartnerListResponse) 
  async findAlternativeByImage( 
                      @Args('image') image: string, 
                      @Args("minPrice") minPrice: number,
                      @Args("maxPrice") maxPrice: number,
                      @Args("likeliness") likeliness: number): Promise<ArticlePartnerListResponse> {
    // console.log(image)
    // const imageData = image.split(';base64,').pop();
    // const imageBuffer = Buffer.from(imageData, 'base64');
    return await this.AnalysisService.findAlternativebyImage(image, minPrice, maxPrice, likeliness);
  }

}
