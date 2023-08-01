import dotenv from "dotenv";
import { APP_FILTER } from "@nestjs/core";

import { Module, OnModuleInit } from "@nestjs/common";

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
  async onModuleInit() {}
}
