import { HttpContext, HttpContextToken } from '@angular/common/http';

export const LOADER = new HttpContextToken<LoaderAndToasterContext>(() => {
  return { loaderName: 'primary', showToaster: false };
});

export interface LoaderAndToasterContext {
  loaderName: string;
  showToaster: boolean;
  toastSuccessMessage?: string;
  toastFailureMessage?: string;
  toasterOptions?: any;
}

/**
 * Use this method for adding the loader for http requests
 */
export function addLoader(loaderName: string) {
  return new HttpContext().set(LOADER, { loaderName, showToaster: false });
}

/**
 * Use this method for adding the loader and toaster notification for http requests
 */
export function addLoaderAndToaster(loaderName: string, toastSuccessMessage: string, toasterOptions?: any) {
  return new HttpContext().set(LOADER, {
    loaderName,
    showToaster: true,
    toastSuccessMessage,
    toasterOptions,
  });
}
