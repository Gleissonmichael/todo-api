import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity({ schema: "main" })
export class User {
  @PrimaryKey()
  id: number;

  @Property({ nullable: true })
  deletedAt: Date;

  @Property()
  name: string;

  @Property({ unique: true })
  email: string;

  @Property()
  birthday: Date;

  @Property()
  start: Date;

  @Property()
  date: Date;

  @Property()
  active: boolean;

  constructor(
    name: string,
    email: string,
    active: boolean,
    birthday: Date,
    start: Date
  ) {
    this.name = name;
    this.email = email;
    this.active = true;
    this.birthday = birthday;
    this.start = start;
    this.date = new Date();
  }
}
