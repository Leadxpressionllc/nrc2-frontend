import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable, finalize, tap } from 'rxjs';
import { LOADER, LoaderAndToasterContext } from '../loader-context/http-loader.context';

/**
 * Interceptor that adds loader for http requests and then hide loader on receiving the response from the server.
 */
@Injectable()
export class LoaderAndToasterInterceptor implements HttpInterceptor {
  constructor(
    private spinnerService: NgxSpinnerService,
    private toasterService: ToastrService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const loaderAndToasterContext: LoaderAndToasterContext = request.context.get(LOADER);

    this.spinnerService.show(loaderAndToasterContext.loaderName);

    return next.handle(request).pipe(
      tap({
        next: (res: any) => {
          if (res.type !== 0 && loaderAndToasterContext.showToaster) {
            this.showSuccessToaster(<string>loaderAndToasterContext.toastSuccessMessage, loaderAndToasterContext.toasterOptions);
          }
        },
        error: (error: any) => {},
      }),
      finalize(() => this.spinnerService.hide(loaderAndToasterContext.loaderName))
    );
  }

  showSuccessToaster(message: string, toasterOptions: any) {
    if (!toasterOptions) {
      toasterOptions = {};
    }
    this.toasterService.success(message, 'Success', {
      ...toasterOptions,
      onActivateTick: true,
    });
  }

  showErrorToaster(message: string) {
    this.toasterService.error(message, 'Error', {
      onActivateTick: true,
    });
  }
}
