import { HttpException, HttpStatus } from '@nestjs/common';

export class AuthError extends HttpException {
  constructor(message: string, context?: Record<string, unknown>) {
    super(
      {
        statusCode: HttpStatus.UNAUTHORIZED,
        message,
        context,
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}
