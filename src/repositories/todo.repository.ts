// @ts-nocheck
import { Injectable } from "@nestjs/common";
import { Todo } from "../domain/entities/todo";
import mockData from "../mock/mock.json";

let data = mockData;
@Injectable()
export class TodoRepository {
  constructor() {}

  getAll(): Todo[] {
    return data as Todo[];
  }

  getByTodoId(id: number): Todo {
    const todoDetail = data as Todo[];

    return todoDetail.data.find((e) => e.id == id);
  }

  updateTodo(id: number, newTodo: Todo): Todo {
    const index = data.data.findIndex((e) => e.id == id);

    console.log(newTodo)
    data.data[index] = newTodo;

    return data.data[index];
  }

  createTodo(newTodo: Todo): Todo {
    data.data.push(newTodo);
    return data.data;
  }

  deleteByTodoId(id: number): Todo {
    const todos = data as Todo[];

    var index = todos.indexOf((e) => e.id === id);

    if (index > -1) {
      todos.data.splice(index, 1);
    }
    return todos;
  }
}
