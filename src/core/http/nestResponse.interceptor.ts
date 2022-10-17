import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { AbstractHttpAdapter, HttpAdapterHost } from '@nestjs/core';
import { map, Observable } from 'rxjs';
import { NestResponse } from './nestResponse';

@Injectable()
export class NestResponseInterceptor implements NestInterceptor {
  private httpAdapter: AbstractHttpAdapter;

  constructor(adapterHost: HttpAdapterHost) {
    this.httpAdapter = adapterHost.httpAdapter;
  }

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((controllerResponse: NestResponse) => {
        if (controllerResponse instanceof NestResponse) {
          const ctx = context.switchToHttp();
          const response = ctx.getResponse();
          const { status, headers, body } = controllerResponse;

          const headersName = Object.getOwnPropertyNames(headers);

          headersName.forEach((header: string) => {
            const headerValue = headers[header];
            this.httpAdapter.setHeader(response, header, headerValue);
          });

          this.httpAdapter.status(response, status);

          return body;
        }

        return controllerResponse;
      }),
    );
  }
}
