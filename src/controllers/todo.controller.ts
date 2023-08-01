// @ts-nocheck
import {
  Controller,
  Delete,
  Get,
  Post,
  Req,
  Put,
  Param,
  Body,
} from "@nestjs/common";
import { Result } from "../modules/result";
import { TodoService } from "../services/todo/todo.service";
import { Request } from "express";
import { Todo } from "../domain/entities/todo";

@Controller("/todo")
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get("/")
  async getAll(@Req() request: Request): Promise<Result<any>> {
    const result = await this.todoService.getAll();
    return new Result<any>(true, result, null);
  }

  @Get("/:id")
  async getByTodoId(@Req() request: Request): Promise<Result<any>> {
    const id = request.params.id;

    const result = await this.todoService.getByTodoId(id);
    return new Result<any>(true, result, null);
  }

  @Post("/")
  async createTodo(@Req() request: Request): Promise<Result<any>> {
    const todo = request.body.todo;

    console.log(todo);

    const result = await this.todoService.createTodo(todo);
    return new Result<any>(true, result, null);
  }

  @Put("/:id")
  async updateTodo(@Req() request: Request): Promise<Result<any>> {
    const todo = request.body.todo;
    const id = request.params.id;

    const result = await this.todoService.updateTodo(id, todo);
    return new Result<any>(true, result, null);
  }

  @Delete("/:id")
  async deleteTodo(@Req() request: Request): Promise<Result<any>> {
    const id = request.params.id;

    const result = await this.todoService.deleteByTodoId(id);
    return new Result<any>(true, result, null);
  }
}
