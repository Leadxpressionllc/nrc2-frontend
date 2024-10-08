import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { constants } from 'src/app/app.constant';
import { environment } from 'src/environments/environment';
import { AuthService } from '../services/auth.service';
import { AppService } from '../utility-services/app.service';

/**
 * Interceptor that appends baseUrl to the backend API routes and adds http headers
 */
@Injectable()
export class InterceptedHttp implements HttpInterceptor {
  private byPassUrls: string[] = ['/i18n/', '/icons/'];

  constructor(
    private authService: AuthService,
    private toastrService: ToastrService,
    private translateService: TranslateService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    request = this._cloneRequest(request);

    return next.handle(request).pipe(
      catchError(this._onCatch),
      tap({
        next: (res: any) => {
          if (res.type !== 0) {
            this._onSuccess(res);
          }
        },
        error: (error: any) => {
          this._onError(error);
        },
      })
    );
  }

  private _cloneRequest(request: HttpRequest<any>): HttpRequest<any> {
    if (this.byPassUrls.findIndex((url) => request.url.toLowerCase().includes(url.toLowerCase())) > -1) {
      return request;
    }

    let headerKeys = constants.apiRequestHeaderKeys;
    const defaultHeaderOptions = constants.apiRequestHeaders.default;

    // Check if content-type needs not be set manually then skip default content-type : application/json
    if (AppService.isUndefinedOrNull(request.params.get(headerKeys.custom.skipContentType))) {
      request = request.clone({ headers: request.headers.set(headerKeys.contentType, defaultHeaderOptions.contentType) });
    } else {
      request = request.clone({ params: request.params.delete(headerKeys.custom.skipContentType) });
    }

    request = request.clone({ url: this._appendApiBaseUrl(request.url) });
    return request;
  }

  private _appendApiBaseUrl(requestUrl: string): string {
    if (requestUrl.indexOf('http') !== -1) {
      return requestUrl;
    }
    return environment.apiBaseUrl + requestUrl;
  }

  private _onCatch(error: any, caught: Observable<any>): Observable<any> {
    return throwError(() => error.error);
  }

  private _onSuccess(response: Response): void {}

  private _onError(error: any): void {
    console.error('Error', error);

    if (error) {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        // this.authService.logout(true);
      } else if (error instanceof ProgressEvent) {
        this.toastrService.error(
          this.translateService.instant('errorMessages.internetConnectionError'),
          this.translateService.instant('errorMessages.somethingWentWrong')
        );
      } else if (Array.isArray(error)) {
        const err = error[0];

        if (err && err.name === constants.errors.name.unknown) {
          this.toastrService.error(err.message, this.translateService.instant('errorMessages.somethingWentWrong'));
        }
      }
    }
  }
}
