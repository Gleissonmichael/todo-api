import { Controller, Options, Res } from "@nestjs/common";
import { Response } from "express";

@Controller()
export class AppController {
  @Options("*")
  handleOptions(@Res() res: Response) {
    res.setHeader("Access-Control-Allow-Origin", "*"); // Ou domínios permitidos
    res.setHeader("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.status(200).send();
  }
}
