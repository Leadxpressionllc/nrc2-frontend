import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: ':offerId/:userId',
    data: { title: 'Offers for you...' },
    loadComponent: async () => (await import('./email-offer.component')).EmailOfferComponent,
  },
];
