import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerService } from './logger/logger.service';
import * as bodyParser from 'body-parser';

/**
 * Bootstrap launcher
 *
 * @async
 * @function
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const configService: ConfigService = app.get(ConfigService);
  const logger: LoggerService = new LoggerService();

  app.enableCors();
  logger.verbose(`Database URI => ${configService.get('database.uri')}`);
  logger.verbose(
    `Application listening on port => ${configService.get('port')}`,
  );
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  await app.listen(configService.get('port'));
}
bootstrap();
