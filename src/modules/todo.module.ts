import { Module } from '@nestjs/common';
import { MessagesDictionary } from '../messages.dictionary';
import { TodoController } from '../controllers/todo.controller';
import { TodoService } from '../services/todo/todo.service';
import { TodoRepository } from '../repositories/todo.repository';

@Module({
  imports: [],
  controllers: [TodoController],
  providers: [TodoService, TodoRepository, MessagesDictionary],
  exports: [TodoService, TodoRepository, MessagesDictionary],
})
export class TodoModule {}
