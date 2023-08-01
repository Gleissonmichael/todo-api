import { User } from '../domain/entities/user';
import { Injectable, Scope } from '@nestjs/common';
// import { EmployeesRepository } from 'src/repositories/employees.repository';

interface IToken {
  id: number;
  name: string;
  email: string;
  uid: string;
  client: number;
  permissions: [];
  iat: number;
  exp: number;
}
@Injectable({ scope: Scope.REQUEST })
export class AuthService {
  private token: any;

  constructor() {}

  async set(token: IToken) {
    this.token = token;
  }

  async get(): Promise<User> {
    const user = new User('Teste', 'Teste', true, new Date(), new Date())//await this.employees.byId(this.token.id).get();
    return user;
  }
}
