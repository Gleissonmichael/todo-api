// @ts-nocheck
import { Controller, Delete, Get, Post, Req } from "@nestjs/common";
import { Result } from "../modules/result";
import { SessionService } from "../services/sessions/session.service";
import { Request } from "express";
import { MessagesDictionary } from "../messages.dictionary";
import { ThrowType, Validation } from "./validations/validation";

@Controller("/sessions")
export class SessionController {
  constructor(
    private readonly sessionService: SessionService,
    private readonly messages: MessagesDictionary
  ) {}

  @Post()
  async create(@Req() request: Request): Promise<Result<any>> {
    const username = request.body.username;
    const client = request.body.client;
    const password = request.body.password;

    const operation = request.query.operation as string;

    if (operation == "1" || !operation) {

      const token = await this.sessionService.create(username, password);

      return new Result<any>(true, token, null);
    } else if (operation == "2") {
      //prettier-ignore
      Validation.validate(request.body, this.messages.dictionary())
        .field('password').required().scalar().check( f => f
          .not.valid().throw(422, 1025)
          .not.supplied().throw(422, 1026)
          .not.exists().throw(422, 1026)
          .not.string().throw(422, 1025)
          .not.length(1, 30).throw(422, 1025)
        )
        .field('username').required().scalar().check( f => f
          .not.valid().throw(422, 1021)
          .not.supplied().throw(422, 1040)
          .not.exists().throw(422, 1040)
          .not.string().throw(422, 1021)
        ).throws(ThrowType.Single)

      const token = await this.sessionService.create(
        username,
        password,
        client
      );

      return new Result<any>(true, token, null);
    }
  }

  @Get("/:uid/access/new")
  async renew(@Req() request: Request): Promise<Result<any>> {
    const session = request.params.uid;

    //prettier-ignore
    Validation.validate(request.params, this.messages.dictionary())
    .field('uid').required().scalar().check( f => f
      .not.valid().throw(422, 1041)
      .not.supplied().throw(422, 1042)
      .not.exists().throw(422, 1042)
      .not.string().throw(422, 1041)
      .not.length(1, 36).throw(422, 1041)
    ).throws(ThrowType.Single)
    const access = request.query.access.toString();

    //prettier-ignore
    Validation.validate(request.query, this.messages.dictionary())
      .field('access').required().scalar().check( f => f
        .not.valid().throw(422, 1037)
        .not.supplied().throw(422, 1038)
        .not.exists().throw(422, 10238)
        .not.string().throw(422, 1037)
      ).throws(ThrowType.Single)

    const token = await this.sessionService.renew(session, access);

    return new Result<any>(true, token, null);
  }

  @Delete("/:uid")
  async logout(@Req() request: Request): Promise<Result<any>> {
    const uid = request.params.uid;

    //prettier-ignore
    Validation.validate(request.params, this.messages.dictionary())
    .field('uid').required().scalar().check( f => f
      .not.valid().throw(422, 1041)
      .not.supplied().throw(422, 1042)
      .not.exists().throw(422, 1042)
      .not.length(1, 36).throw(422, 1041)
    ).throws(ThrowType.Single)

    await this.sessionService.logout(uid);
    return new Result<any>(true);
  }
}
