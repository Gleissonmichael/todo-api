import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus, NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import { CustomError } from '../../custom.error';

@Catch()
export class CustomErrorFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    //get the context
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    //log the exception
    console.log(exception);

    //check each exception to return specific error
    if (exception instanceof CustomError) {
      const status = exception.getStatus();
      response.status(status).json({
        success: false,
        data: {
          code: exception.code,
          date: new Date().toISOString(),
          message: exception.message,
        },
      });
    } else if (exception instanceof NotFoundException) {
      response.status(HttpStatus.NOT_FOUND).json({
        success: false,
        data: {
          code: 1009,
          date: new Date().toISOString(),
          message: exception.message,
        },
      });
    } else if (exception instanceof Error) {
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        data: {
          code: 1005,
          date: new Date().toISOString(),
          message: exception.message ?? 'unknown error',
        },
      });
    } else {
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        data: {
          code: 1005,
          date: new Date().toISOString(),
          message: 'unknown error',
        },
      });
    }
  }
}
