import { Module } from '@nestjs/common';
import { AnalysisService } from './analysis.service';
import { AnalysisResolver } from './analysis.resolver';
import { ArticlePartner } from 'src/database/entities/article.partner.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScraperService } from 'src/scraper/scraper.service';
import { ArticlePartnerService } from 'src/article/partner/article.partner.service';
import { ArticlePartnerModule } from 'src/article/partner/article.partner.module';
import { Users } from 'src/database/entities/users.entity';
import { LoggerModule } from 'src/logger/logger.module';
import { Criteria } from 'src/database/entities/criteria.entity';
import { ArticleWebService } from '../article/web/article.web.service';
import { ArticleWeb } from '../database/entities/article.web.entity';
import { QuestionService } from '../question/question.service';
import { Question } from '../database/entities/question.entity';

@Module({
  imports: [
    LoggerModule,
    TypeOrmModule.forFeature([
      ArticlePartner,
      Users,
      Criteria,
      ArticleWeb,
    ]),
  ],
  controllers: [],
  providers: [
    AnalysisService,
    AnalysisResolver,
    ScraperService,
    ArticlePartnerService,
    ArticleWebService,
  ],
  exports: [AnalysisService],
})
export class AnalysisModule {}
