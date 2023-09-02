import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Response } from 'express';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';

const genericError =
  'Your request could not be processed at this moment. Please try again later.';

const partialErrors = {
  duplicate: {
    debug: 'duplicate key',
    message: 'This record already exists.',
  },
  foreignKeyConstraint: {
    debug: 'violates foreign key constraint',
    message: 'This is not a valid request.',
  },
};

@Catch(
  HttpException,
  Error,
  InternalServerErrorException,
  UnprocessableEntityException,
  QueryFailedError,
  EntityNotFoundError,
)
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let httpcode = 422;
    if (typeof exception?.getStatus === 'function') {
      httpcode = exception?.getStatus();
    }

    if (process.env.NODE_ENV === 'dev') console.error('Error: ', exception);

    let message = exception?.response?.message;
    if (exception?.message && !message) {
      message = this.parseMessage(exception.message);
    }

    const errorResponse = {
      status: 0,
      statusCode: httpcode,
      data: null,
      message: message || genericError,
      debug: exception?.message || exception?.response?.debug,
    };

    if (httpcode > 499) httpcode = 422;

    response.status(httpcode).json(errorResponse);
  }

  parseMessage(message: string): string | null {
    const key = Object.keys(partialErrors).find((key) =>
      message.includes(partialErrors[key].debug),
    );
    if (key) {
      return partialErrors[key]?.message;
    }
    return null;
  }
}
