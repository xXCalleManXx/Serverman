import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {AppService} from "./app.service";

const args = process.argv.slice(1),
  serve = args.some(val => val === '--serve');

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const appService = app.get(AppService);

  appService.start(serve);

  // application logic...
}
bootstrap();
