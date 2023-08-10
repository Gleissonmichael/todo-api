import { Injectable } from "@nestjs/common";

import { TodoRepository } from "../../repositories/todo.repository";
import { Todo } from "../../domain/entities/todo";

@Injectable()
export class TodoService {
  constructor(private todoRepository: TodoRepository) {}

  async getAll(): Promise<Todo[]> {
    const result = await this.todoRepository.getAll();
    return result;
  }

  async getByTodoId(id: number): Promise<Todo> {
    const result = await this.todoRepository.getByTodoId(id);
    return result;
  }

  async createTodo(newTodo: Todo): Promise<Todo> {
    const result = await this.todoRepository.createTodo(newTodo);
    return result;
  }

  async updateTodo(id: number, newTodo: Todo): Promise<Todo> {
    const result = await this.todoRepository.updateTodo(id, newTodo);
    return result;
  }

  async completeTodo(id: number): Promise<Todo> {
    const result = await this.todoRepository.completeTodo(id);
    return result;
  }

  async deleteByTodoId(id: number): Promise<Todo> {
    const result = await this.todoRepository.deleteByTodoId(id);
    return result;
  }
}
