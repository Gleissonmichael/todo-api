// @ts-nocheck
import { Injectable } from "@nestjs/common";
import { Session } from "../domain/entities/session";
import { EntityManager } from "@mikro-orm/mysql";
import { AutoPath } from "@mikro-orm/core/typings";

@Injectable()
export class SessionsRepository {
  private _criterias: any[] = [];
  private _populate: string[];

  constructor() {}

  async add(session: Session): Promise<Session> {
    let response: Session;

    response = { uid: 123 };
    return response;
  }

  async get(): Promise<Session> {
    this._criterias.push({ deletedAt: null });
    const result = this.em.findOne(
      Session,
      { $and: this._criterias },
      { schema: "main", populate: this._populate as any }
    );
    this.clear();
    return result;
  }

  populate<P extends string>(path: AutoPath<Session, P>[]): SessionsRepository {
    this._populate = path;
    return this;
  }

  clear() {
    this._populate = [] as any;
    this._criterias = [];
    return;
  }
}
