import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '@core/services';

type AuthGuardOptions = {
  // blockAfterAuthentication: An optional boolean that specifies whether the guard should block navigation to route after user authenticated.
  blockAfterAuthentication: boolean;
  publicRoute: boolean;
};

const defaultAuthGuardOptions = (): AuthGuardOptions => ({
  blockAfterAuthentication: false,
  publicRoute: false,
});

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const options: AuthGuardOptions = route.data['authParams'] ? route.data['authParams'] : defaultAuthGuardOptions();

  if (authService.isAuthenticated()) {
    if (options.blockAfterAuthentication) {
      const landingPage = authService.getLandingPage();
      router.navigate([landingPage]);
      return false;
    }
  } else if (state.url && !options.publicRoute) {
    router.navigate(['/home']);
    return false;
  }

  return true;
};
