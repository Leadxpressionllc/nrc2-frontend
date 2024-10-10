import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { constants } from '@app/constant';
import { addLoader } from '@core/loader-context';
import { SignupFlow } from '@core/models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  constructor(private httpClient: HttpClient) {}

  getSignupFlow(id: string): Observable<SignupFlow> {
    return this.httpClient.get<SignupFlow>(`${constants.apiUrl.signupFlow.base}/${id}`, {
      context: addLoader('signupFlowLoader'),
    });
  }
}
