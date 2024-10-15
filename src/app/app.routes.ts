import { Routes } from '@angular/router';
import { authGuard } from '@core/guards';
import { signupFlowResolveFn } from '@core/resolvers';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadChildren: async () => (await import('@pages/home')).routes,
    canActivate: [authGuard],
    resolve: {
      signupFlow: signupFlowResolveFn,
    },
    data: {
      authParams: { blockAfterAuthentication: true, publicRoute: true },
    },
  },
  {
    path: 'surveys',
    loadChildren: async () => (await import('@pages/surveys')).routes,
    canActivate: [authGuard],
  },
  {
    path: 'offers',
    loadChildren: async () => (await import('@pages/offers')).routes,
    canActivate: [authGuard],
  },
  {
    path: 'email-offer',
    loadChildren: async () => (await import('@pages/email-offer')).routes,
  },
  {
    path: 'offer-redirect',
    loadChildren: async () => (await import('@pages/offer-redirect')).routes,
    canActivate: [authGuard],
  },
  {
    path: 'redirect',
    loadChildren: async () => (await import('@pages/redirect')).routes,
  },
  {
    path: 'jobs',
    loadChildren: async () => (await import('@pages/jobs')).routes,
  },
  {
    path: 'terms-policy',
    loadChildren: async () => (await import('@pages/terms-policy')).routes,
  },
  {
    path: 'unsubscribe',
    loadChildren: async () => (await import('@pages/unsubscribe')).routes,
  },
  {
    path: 'marketing-associates',
    loadChildren: async () => (await import('@pages/marketing-associates')).routes,
  },

  { path: '**', pathMatch: 'full', redirectTo: 'home' },
];
