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

  getDomainInfo(domain: string): Observable<DomainInfo> {
    return this.httpClient.get<DomainInfo[]>('/assets/json/email-domains.json').pipe(
      map((domains: DomainInfo[]) => {
        let domainInfo = <DomainInfo>domains.find((domainInfo: DomainInfo) => domainInfo.domain === domain);
        if (domainInfo) {
          document.documentElement.setAttribute('data-theme', domainInfo.theme);
        }
        return domainInfo;
      })
    );
  }
}
