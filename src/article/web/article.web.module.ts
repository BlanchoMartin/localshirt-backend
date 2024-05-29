import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { LoggerModule } from '../../logger/logger.module';
import { ArticleWeb } from 'src/database/entities/article.web.entity';
import { ArticleWebService } from './article.web.service';
import { ArticleWebResolver } from './article.web.resolver';
import {Criteria} from "../../database/entities/criteria.entity";
import { ScheduleModule } from '@nestjs/schedule';
import {Question} from "../../database/entities/question.entity";

/**
 * Article Web Module
 * 
 * @module
 */
@Module({
  imports: [
    ScheduleModule.forRoot(),
    PassportModule,
    LoggerModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          global: true,
          secret: configService.get<string>('keys.secret'),
          signOptions: { expiresIn: '60s' },
        };
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([ArticleWeb, Criteria]),
  ],
  providers: [ArticleWebService, ArticleWebResolver],
  exports: [ArticleWebService],
})
export class ArticleWebModule {}