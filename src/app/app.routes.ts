import { Routes } from '@angular/router';
import { authGuard, emailDomainGuard } from '@core/guards';
import { domainInfoResolveFn, signupFlowResolveFn } from '@core/resolvers';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadChildren: async () => (await import('@pages/home')).routes,
    canActivate: [emailDomainGuard],
    resolve: {
      signupFlow: signupFlowResolveFn,
    },
  },
  {
    path: 'surveys',
    loadChildren: async () => (await import('@pages/surveys')).routes,
    canActivate: [emailDomainGuard, authGuard],
    resolve: {
      domainInfo: domainInfoResolveFn,
    },
  },
  {
    path: 'offers',
    loadChildren: async () => (await import('@pages/offers')).routes,
    canActivate: [emailDomainGuard, authGuard],
    resolve: {
      domainInfo: domainInfoResolveFn,
    },
  },
  {
    path: 'offer-redirect',
    loadChildren: async () => (await import('@pages/offer-redirect')).routes,
    canActivate: [emailDomainGuard, authGuard],
    resolve: {
      domainInfo: domainInfoResolveFn,
    },
  },
  {
    path: 'bw',
    loadChildren: async () => (await import('@pages/boardwalk-offers')).routes,
    canActivate: [emailDomainGuard, authGuard],
  },
  {
    path: 'email-offer',
    loadChildren: async () => (await import('@pages/email-offer')).routes,
    canActivate: [emailDomainGuard],
  },
  {
    path: 'redirect',
    loadChildren: async () => (await import('@pages/redirect')).routes,
    canActivate: [emailDomainGuard],
  },
  {
    path: 'jobs',
    loadChildren: async () => (await import('@pages/jobs')).routes,
    canActivate: [emailDomainGuard],
  },
  {
    path: 'terms-policy',
    loadChildren: async () => (await import('@pages/terms-policy')).routes,
    canActivate: [emailDomainGuard],
  },
  {
    path: 'unsubscribe',
    loadChildren: async () => (await import('@pages/unsubscribe')).routes,
    canActivate: [emailDomainGuard],
  },
  {
    path: 'marketing-associates',
    loadChildren: async () => (await import('@pages/marketing-associates')).routes,
    canActivate: [emailDomainGuard],
  },
  {
    path: 'other',
    loadChildren: async () => (await import('@pages/email-domain-pages')).routes,
    canActivate: [emailDomainGuard, authGuard],
    resolve: {
      domainInfo: domainInfoResolveFn,
    },
    data: {
      authParams: { blockAfterAuthentication: true, publicRoute: true },
    },
  },

  { path: '**', pathMatch: 'full', redirectTo: 'home' },
];
