import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { constants } from '@app/constant';

export const emailDomainGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const router = inject(Router);

  let domain: string = window.location.hostname.replaceAll('www.', '');

  if (domain === 'nationalresourceconnect.com' && state.url.indexOf('/other') >= 0) {
    router.navigate(['/home']);
    return false;
  }

  if (constants.emailDomains.includes(domain) && !_isRouteAllowedForEmailDomain(state.url)) {
    router.navigate(['/other']);
    return false;
  }

  return true;
};

const _isRouteAllowedForEmailDomain = (url: string): boolean => {
  const allowedRoutes: string[] = ['/other', '/surveys', '/offers', '/offer-redirect'];
  for (let i = 0; i < allowedRoutes.length; i++) {
    if (url.indexOf(allowedRoutes[i]) >= 0) {
      return true;
    }
  }

  return false;
};
