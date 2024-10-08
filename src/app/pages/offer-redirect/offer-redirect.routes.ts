import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: ':offerId',
    data: { title: 'Loading offers for you...' },
    loadComponent: async () => (await import('./offer-redirect.component')).OfferRedirectComponent,
  },
  {
    path: ':surveyId/:offerPoolId/:offerId',
    data: { title: 'Loading offers for you...' },
    loadComponent: async () => (await import('./offer-redirect.component')).OfferRedirectComponent,
  },
];
