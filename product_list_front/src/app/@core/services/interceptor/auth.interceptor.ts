import { Injectable, Injector } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from "../auth/auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private injector: Injector) {}

  intercept(request: HttpRequest<string>, next: HttpHandler): Observable<HttpEvent<string>> {
    const authService = this.injector.get(AuthService);
    const token = authService.getToken();

    if (token) {
      const authReq = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${token}`)
      });

      return next.handle(authReq);
    }

    return next.handle(request);
  }
}
