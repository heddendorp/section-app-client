import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class TenantHeaderInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const tenantId = localStorage.getItem('tenantId');
    if (tenantId) {
      request = request.clone({
        setHeaders: {
          'x-tumi-tenant': tenantId
        }
      });
    }
    return next.handle(request);
  }
}
