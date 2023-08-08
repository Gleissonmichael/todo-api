import dotenv from "dotenv";
import { APP_FILTER } from "@nestjs/core";

import { Module, OnModuleInit, MiddlewareConsumer } from "@nestjs/common";
 
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from "@nestjs/config";
import { SessionsModule } from "./modules/sessions.module";
import { CustomErrorFilter } from "./controllers/filters/custom.error.filter";

import { ScheduleModule } from "@nestjs/schedule";
import { TodoModule } from "./modules/todo.module";

dotenv.config();
@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ envFilePath: [".env"], isGlobal: true }),
    SessionsModule,
    TodoModule,
    HttpModule
  ],
  exports: [SessionsModule, TodoModule],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: CustomErrorFilter,
    },
  ],
})
export class AppModule implements OnModuleInit {
  constructor() {}

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
        res.header(
          "Access-Control-Allow-Headers",
          "Origin, X-Requested-With, Content-Type, Accept"
        );
        next();
      })
      .forRoutes("*");
  }

  async onModuleInit() {}
}
