import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { LoggerModule } from '../logger/logger.module';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../database/entities/users.entity';
import { MailService } from '../mail/mail.service';
import { MailModule } from '../mail/mail.module';
import { AuthResolver } from './auth.resolver';
import { ArticlePartner } from 'src/database/entities/article.partner.entity';

@Module({
  imports: [
    MailModule,
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
    TypeOrmModule.forFeature([Users, ArticlePartner]),
  ],
  providers: [AuthService, AuthResolver],
  exports: [AuthService],
})
export class AuthModule {}
