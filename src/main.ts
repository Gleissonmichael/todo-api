import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {});

  app.enableCors();

  //start listening
  await app.listen(8080);

  //notify started
  console.log("server started");
}
bootstrap();
