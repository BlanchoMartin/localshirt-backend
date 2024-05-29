import { Module } from '@nestjs/common';
import { CriteriaResolver } from './criteria.resolver';
import { CriteriaService } from './criteria.service';
import { PassportModule } from '@nestjs/passport';
import { LoggerModule } from '../logger/logger.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Criteria } from '../database/entities/criteria.entity';
import { Question } from '../database/entities/question.entity';
import { Users } from 'src/database/entities/users.entity';

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
    TypeOrmModule.forFeature([Criteria, Users]),
  ],
  providers: [CriteriaService, CriteriaResolver],
  exports: [CriteriaService],
})
export class CriteriaModule {}
