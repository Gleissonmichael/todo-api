import { HttpException } from '@nestjs/common';

export class CustomError extends HttpException {
  public code: number;

  constructor(status: number, code: number, message: string, error?: Error) {
    super(message, status);
    this.code = code;
    Object.setPrototypeOf(this, CustomError.prototype);

    if (error) this.stack = error.stack;
  }
}
