import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class TenantHeaderInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    const tenantId = localStorage.getItem('tenantId');
    if (tenantId && request.headers.keys().length) {
      request = request.clone({
        setHeaders: {
          'x-tumi-tenant': tenantId,
        },
      });
    }
    return next.handle(request);
  }
}
