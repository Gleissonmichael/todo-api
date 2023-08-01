import moment from "moment";
import jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import { Injectable } from "@nestjs/common";
import { AccessToken } from "./access.token";
import { Session } from "../../domain/entities/session";
import { CustomError } from "../../custom.error";
import { SessionsRepository } from "../../repositories/sessions.repository";
import { User } from "../../domain/entities/user";

@Injectable()
export class SessionService {
  static secret = "ciclodefeedback@token1234";

  constructor(private sessions: SessionsRepository) {}

  async create(username: string, password: string);
  
  async create(
    username: string,
    password: string
  ): Promise<AccessToken | string> {
    const passwordMock = "Acesso123";

    const user = new User("teste", username, true, new Date(), new Date());

    if (password !== passwordMock) {
      throw new CustomError(401, 1004, "user not found");
    }

    let session = new Session(user, moment().add(1, "year").toDate());
    session = await this.sessions.add(session);

    const access = jwt.sign(
      {
        name: "MockTeste",
      },
      SessionService.secret,
      { expiresIn: "660 min" }
    );

    return new AccessToken(session.uid, access);
  }
}
