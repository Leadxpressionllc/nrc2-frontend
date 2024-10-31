import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { DomainInfo } from '@core/models';
import { CommonService } from '@core/services';
import { AppService } from '@core/utility-services';
import { Observable } from 'rxjs';

export const domainInfoResolveFn: ResolveFn<any> = (): Observable<DomainInfo> => {
  const commonService = inject(CommonService);
  const domain: string = window.location.ancestorOrigins[0];
  return commonService.getDomainInfoByDomain(domain);
};
