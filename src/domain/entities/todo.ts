// @ts-nocheck
import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ schema: 'main' })
export class Todo {
  @PrimaryKey()
  id: number;

  @Property()
  name: string;

  @Property()
  category: string;

  @Property()
  isCompleted: boolean;


  @Property()
  updatedAt: Date;


  constructor(id: string, name: string, category: string, isCompleted: boolean) {
    this.id = id;
    this.name = name;
    this.category = category;
    this.isCompleted = isCompleted;
  }
}
