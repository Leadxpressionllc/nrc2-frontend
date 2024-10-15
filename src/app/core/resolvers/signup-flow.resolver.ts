import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { constants } from '@app/constant';
import { SignupFlow } from '@core/models';
import { CommonService } from '@core/services';
import { Observable, of } from 'rxjs';

export const signupFlowResolveFn: ResolveFn<any> = (route: ActivatedRouteSnapshot): Observable<SignupFlow> => {
  const commonService = inject(CommonService);

  const flowId = route.queryParamMap.get('flowId');

  if (flowId) {
    return commonService.getSignupFlow(flowId);
  }

  const defaultSignupFlow: SignupFlow = constants.defaultSignupFlow;
  return of(defaultSignupFlow);
};
