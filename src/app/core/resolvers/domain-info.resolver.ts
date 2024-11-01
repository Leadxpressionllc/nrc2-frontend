import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { DomainInfo } from '@core/models';
import { CommonService } from '@core/services';
import { Observable } from 'rxjs';

export const domainInfoResolveFn: ResolveFn<any> = (): Observable<DomainInfo> => {
  const commonService = inject(CommonService);

  let fullDomain: string = window.location.ancestorOrigins[0];
  if (!fullDomain) {
    // redirect to NRC home page.
    window.open('https://www.nationalresourceconnect.com/', '_self');
  }

  return commonService.getDomainInfo(fullDomain);
};
