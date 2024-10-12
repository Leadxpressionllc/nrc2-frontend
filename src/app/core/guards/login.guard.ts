import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '@core/services';
import { catchError, map, of } from 'rxjs';
import { authGuard } from './auth.guard';

export const loginGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const userId = route.params['userId'];

  if (_canStartNewSession(userId, authService)) {
    return authService.autoLogin(userId).pipe(
      map((response) => {
        return true;
      }),
      catchError((err) => {
        router.navigate(['/home']);
        return of(false);
      })
    );
  } else {
    return authGuard(route, state);
  }
};

const _canStartNewSession = (userId: string, authService: AuthService): boolean => {
  if (authService.isAuthenticated()) {
    const authInfo = authService.getAuthInfo();

    if (authInfo && authInfo.user.id !== userId) {
      authService.logout(false);
      return true;
    } else {
      return false;
    }
  }
  return true;
};
