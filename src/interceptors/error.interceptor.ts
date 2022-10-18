import { getResponseOptions } from '@app/decorators/response.decorator';
import { CustomError } from '@app/errors/custom.error';
import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { catchError, Observable, throwError } from 'rxjs';
import * as TEXT from '@app/constants/text.constant';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const { errorCode, errorMessage } = getResponseOptions(
      context.getHandler(),
    );
    return next.handle().pipe(
      catchError((error) => {
        return throwError(
          () =>
            new CustomError(
              { message: errorMessage || TEXT.HTTP_DEFAULT_ERROR_TEXT, error },
              errorCode,
            ),
        );
      }),
    );
  }
}
