import { getResponseOptions } from '@app/decorators/response.decorator';
import {
  HttpResponseSuccess,
  ResponseStatus,
} from '@app/interfaces/response.interface';
import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import * as TEXT from '@app/constants/text.constant';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, T | HttpResponseSuccess<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<T | HttpResponseSuccess<T>> {
    const { successMessage, transform, paginate } = getResponseOptions(
      context.getHandler(),
    );
    if (!transform) {
      return next.handle();
    }
    const request = context.switchToHttp().getRequest();
    return next.handle().pipe(
      map((data: any) => {
        return {
          status: ResponseStatus.Success,
          message: successMessage || TEXT.HTTP_DEFAULT_SUCCESS_TEXT,
          params: {
            isAuthenticated: request.isAuthenticated(),
            isUnauthenticated: request.isUnauthenticated(),
            url: request.url,
            method: request.method,
            routes: request.params,
            payload: request.$validatedPayload || {},
          },
          result: paginate
            ? {
                data: data.documents,
                pagination: {
                  total: data.total,
                  current_page: data.page,
                  per_page: data.perPage,
                  total_page: data.totalPage,
                },
              }
            : data,
        };
      }),
    );
  }
}
