import { Module } from '@nestjs/common';
import configuration from './../config/configuration';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailService } from './mail.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
  ],
  providers: [
    ConfigService,
    {
      provide: MailService,
      useFactory: async (configService: ConfigService) => {
        const smtpConfig = {
          service: configService.get('SMTP_SERVICE'),
          auth: {
            user: configService.get('SMTP_USERNAME'),
            pass: configService.get('SMTP_PASSWORD'),
          },
        };
        const mailerService = new MailService(smtpConfig);
        await mailerService.initialize();
        return mailerService;
      },
      inject: [ConfigService],
    },
  ],
  exports: [MailService],
})
export class MailModule {}
