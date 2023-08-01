// @ts-nocheck
import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { User } from './user';
import { v4 as uuid } from 'uuid';

@Entity({ schema: 'main' })
export class Session {
  @PrimaryKey()
  id: number;

  @Property({ nullable: true })
  deletedAt: Date;

  @Property()
  uid: string;

  @ManyToOne({ fieldName: 'user' })
  user: User;

  @Property()
  expires: Date;

  @Property()
  valid: boolean;

  @Property()
  date: Date;

  constructor(user: User, expires: Date) {
    this.uid = uuid();
    this.user = user;
    this.expires = expires;
    this.valid = true;
    this.date = new Date();
  }
}
