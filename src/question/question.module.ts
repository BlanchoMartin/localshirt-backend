import {Module} from "@nestjs/common";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {LoggerModule} from "../logger/logger.module";
import {JwtModule} from "@nestjs/jwt";
import {TypeOrmModule} from "@nestjs/typeorm";
import {QuestionService} from "./question.service";
import {QuestionResolver} from "./question.resolver";
import {PassportModule} from "@nestjs/passport";
import {Question} from "src/database/entities/question.entity";
import {Users} from "../database/entities/users.entity";

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
    TypeOrmModule.forFeature([Question, Users]),
  ],
  providers: [QuestionService, QuestionResolver],
  exports: [QuestionService],
})
export class QuestionModule {}
