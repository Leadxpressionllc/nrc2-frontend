import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { DomainInfo } from '@core/models';
import { CommonService } from '@core/services';
import { Observable } from 'rxjs';

export const domainInfoResolveFn: ResolveFn<any> = (): Observable<DomainInfo> => {
  const commonService = inject(CommonService);

  let domain: string = window.location.hostname.replaceAll('www.', '');
  return commonService.getDomainInfo(domain);
};
