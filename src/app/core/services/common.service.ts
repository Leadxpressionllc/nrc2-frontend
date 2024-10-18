import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { constants } from '@app/constant';
import { addLoader } from '@core/loader-context';
import { MarketingAssociate, SignupFlow } from '@core/models';
import { Observable } from 'rxjs';

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
}
