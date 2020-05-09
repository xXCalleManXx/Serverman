import {INestApplicationContext} from "@nestjs/common";
import {NestFactory} from "@nestjs/core";
import {AppModule} from "./app.module";
import {AppService} from "./app.service";

let app: INestApplicationContext;

export function GetApp(): INestApplicationContext {
  return app;
}

export async function InitApp(serve: boolean): Promise<INestApplicationContext> {
  app = await NestFactory.createApplicationContext(AppModule);
  await app.init()
  app.enableShutdownHooks();
  const appService = app.get(AppService);
  appService.start(serve);

  return app;
}
