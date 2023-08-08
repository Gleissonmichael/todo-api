import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {});

  const corsOptions: CorsOptions = {
    origin: [
      "http://localhost:4200",
      "https://todo-front-theta.vercel.app/"
    ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    preflightContinue: false,
    credentials: true,
    optionsSuccessStatus: 200,
    allowedHeaders: "Content-Type, Accept",
  };

  app.enableCors(corsOptions);

  //start listening
  await app.listen(8080);

  //notify started
  console.log("server started");
}
bootstrap();
