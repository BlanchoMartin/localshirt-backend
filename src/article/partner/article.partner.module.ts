import { Module } from '@nestjs/common';
import { ArticlePartnerResolver } from './article.partner.resolver';
import { ArticlePartnerService } from './article.partner.service';
import { PassportModule } from '@nestjs/passport';
import { LoggerModule } from '../../logger/logger.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticlePartner } from 'src/database/entities/article.partner.entity';
import { Users } from 'src/database/entities/users.entity';
import { Criteria } from 'src/database/entities/criteria.entity';
import {Question} from "../../database/entities/question.entity";

@Module({
  imports: [
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
    TypeOrmModule.forFeature([
      ArticlePartner,
      Users,
      Criteria,
    ]),
  ],
  providers: [ArticlePartnerService, ArticlePartnerResolver],
  exports: [ArticlePartnerService],
})
export class ArticlePartnerModule {}
