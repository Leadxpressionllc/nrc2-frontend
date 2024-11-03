import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { DomainInfo } from '@core/models';
import { CommonService } from '@core/services';
import { Observable } from 'rxjs';

export const domainInfoResolveFn: ResolveFn<any> = (): Observable<DomainInfo> => {
  const commonService = inject(CommonService);

  const domain: string = window.location.hostname.replaceAll('www.', '');
  // if (!constants.emailDomains.includes(domain)) {
  //   // redirect to NRC home page.
  //   window.open('https://www.nationalresourceconnect.com/', '_self');
  // }

  return commonService.getDomainInfo(domain);
};
