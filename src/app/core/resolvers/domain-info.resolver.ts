import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { DomainInfo } from '@core/models';
import { CommonService } from '@core/services';
import { Observable } from 'rxjs';

export const domainInfoResolveFn: ResolveFn<any> = (): Observable<DomainInfo> => {
  const commonService = inject(CommonService);
  let domain: string = window.location.ancestorOrigins[0];
  if (domain.includes('http') || domain.includes('https')) {
    domain = domain.split('//')[1].split('/')[0];
  }
  return commonService.getDomainInfoByDomain(domain);
};
