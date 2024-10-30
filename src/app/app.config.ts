import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthInterceptor, InterceptedHttp, LoaderAndToasterInterceptor } from '@core/interceptors';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { AngularSvgIconPreloaderModule } from 'angular-svg-icon-preloader';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastrModule } from 'ngx-toastr';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),

    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: LoaderAndToasterInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: InterceptedHttp, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },

    importProvidersFrom(BrowserAnimationsModule),
    importProvidersFrom(NgxSpinnerModule),

    importProvidersFrom(ModalModule.forRoot()),

    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient],
        },
      })
    ),

    importProvidersFrom(
      ToastrModule.forRoot({
        timeOut: 5000,
        extendedTimeOut: 5000,
        positionClass: 'toast-top-right',
        tapToDismiss: false,
        preventDuplicates: true,
        titleClass: 'toast-title',
      })
    ),

    importProvidersFrom(AngularSvgIconModule.forRoot()),
    importProvidersFrom(
      AngularSvgIconPreloaderModule.forRoot({
        configUrl: `./assets/icons/icons.json`,
      })
    ),
  ],
};

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
