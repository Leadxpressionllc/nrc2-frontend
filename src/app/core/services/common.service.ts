import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { constants } from '@app/constant';
import { addLoader } from '@core/loader-context';
import { DomainInfo, MarketingAssociate, SignupFlow } from '@core/models';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  constructor(private httpClient: HttpClient) {}

  getSignupFlow(id: string): Observable<SignupFlow> {
    return this.httpClient.get<SignupFlow>(`${constants.apiUrl.common.signupFlow}/${id}`, {
      context: addLoader('signupFlowLoader'),
    });
  }

  getMarketingAssociates(): Observable<MarketingAssociate[]> {
    return this.httpClient.get<MarketingAssociate[]>(constants.apiUrl.common.marketingAssociates, {
      context: addLoader('marketingAssociateLoader'),
    });
  }

  getDomainInfo(fullDomain: string): Observable<DomainInfo> {
    let domain = '';
    if (fullDomain.includes('http') || fullDomain.includes('https')) {
      domain = fullDomain.split('//')[1].split('/')[0];
    }

    return this.httpClient.get<DomainInfo[]>('/assets/json/other-domains.json').pipe(
      map((domains: DomainInfo[]) => {
        const domainInfo = <DomainInfo>domains.find((domainInfo: DomainInfo) => domainInfo.domain === domain);
        document.documentElement.setAttribute('data-theme', domainInfo.theme);
        domainInfo.fullDomain = fullDomain;
        return domainInfo;
      })
    );
  }
}
