import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

/**
 * Interceptor that adds an Authorization header to requests that are authenticated and target the API URL.
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authorizationHeader = request.headers.get('Authorization');

    if (!request.url.includes('auth') && this.authService.isAuthenticated()) {
      const token = this.authService.getToken();

      if (!request.url.includes('auth')) {
        request = request.clone({
          setHeaders: {
            Authorization: authorizationHeader ? authorizationHeader : `Bearer ${token}`,
          },
        });
      }
    }
    return next.handle(request);
  }
}
