// @ts-nocheck
import { Injectable } from "@nestjs/common";
import { Todo } from "../domain/entities/todo";
import mockData from "../mock/mock.json";

let data = mockData;

function generateId() {
  let sequence = "";

  for (let i = 0; i < 8; i++) {
    const randomNumber = Math.floor(Math.random() * 10); // Gera um número entre 0 e 9
    sequence += randomNumber;
  }

  return sequence;
}
@Injectable()
export class TodoRepository {
  constructor() {}

  getAll(): Todo[] {
    return data.data as Todo[];
  }

  getByTodoId(id: number): Todo {
    const todoDetail = data as Todo[];

    return todoDetail.data.find((e) => e.id == id);
  }

  updateTodo(id: number, newTodo: Todo): Todo {
    const index = data.data.findIndex((e) => e.id == id);

    data.data[index] = newTodo;

    return data.data[index];
  }

  completeTodo(id: number): Todo {
    const index = data.data.findIndex((e) => e.id == id);

    data.data[index].isCompleted = !data.data[index].isCompleted;

    return data.data;
  }

  createTodo(newTodo: Todo): Todo {
    const todo = {
      id: generateId(),
      name: newTodo.name,
      category: newTodo.category,
      isCompleted: false,
    };

    data.data.push(todo);
    return todo;
  }

  deleteByTodoId(id: number): Todo {
    var index = data.data.findIndex((e) => e.id === id);

    if (index > -1) {
      console.log("entrou no if");
      data.data.splice(index, 1);
    }
    return data.data;
  }
}
