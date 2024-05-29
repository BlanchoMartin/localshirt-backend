import { Module } from '@nestjs/common';
import { ScraperService } from './scraper.service';
import { ScraperResolver } from './scraper.resolver';

@Module({
  imports: [],
  controllers: [],
  providers: [ScraperService, ScraperResolver],
  exports: [ScraperService],
})
export class ScraperModule {}
