import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './database/entities/users.entity';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { ArticlePartnerModule } from './article/partner/article.partner.module';
import { ArticleWebModule } from './article/web/article.web.module';
import { CriteriaModule } from './criteria/criteria.module';
import { ScraperModule } from './scraper/scraper.module';
import { QuestionModule } from './question/question.module';
import { AnalysisModule } from './analysis/analysis.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      context: ({ req }) => ({ req }),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [Users],
      synchronize: false,
      autoLoadEntities: true,
    }),
    AuthModule,
    MailModule,
    ArticlePartnerModule,
    ArticleWebModule,
    QuestionModule,
    AnalysisModule,
    ScraperModule,
    CriteriaModule,
  ],
  providers: [],
  controllers: [],
})
export class AppModule {}
