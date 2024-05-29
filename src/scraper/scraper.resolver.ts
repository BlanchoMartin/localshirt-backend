import { Args, Resolver, Query } from '@nestjs/graphql';
import { ScraperService } from './scraper.service';
import { ScraperResponse } from './scraper.model';

@Resolver()
export class ScraperResolver {
  constructor(private scraperService: ScraperService) {}

  @Query((returns) => ScraperResponse)
  async scraper(
    @Args('url') url: string,
  ) {
    return this.scraperService.ScrapeSite(url);
  }
}
