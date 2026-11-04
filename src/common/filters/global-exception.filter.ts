import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { StructuredLogger } from '../logger/structured-logger.service';

interface ErrorBody {
  success: false;
  message: string;
  errors: unknown[];
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: StructuredLogger) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const body = this.createBody(exception);

    if (status >= 500) {
      this.logger.error(
        body.message,
        exception instanceof Error ? exception.stack : undefined,
        'GlobalExceptionFilter',
      );
    } else {
      this.logger.warn(body.message, 'GlobalExceptionFilter');
    }

    response.status(status).json(body);
  }

  private createBody(exception: unknown): ErrorBody {
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      if (typeof response === 'object' && response !== null) {
        const payload = response as Record<string, unknown>;
        return {
          success: false,
          message: this.getMessage(payload.message ?? exception.message),
          errors: Array.isArray(payload.message) ? payload.message : [],
        };
      }

      return { success: false, message: exception.message, errors: [] };
    }

    return {
      success: false,
      message: exception instanceof Error ? exception.message : 'Internal server error',
      errors: [],
    };
  }

  private getMessage(message: unknown): string {
    if (Array.isArray(message)) {
      return 'Validation failed';
    }
    return typeof message === 'string' ? message : 'Request failed';
  }
}
