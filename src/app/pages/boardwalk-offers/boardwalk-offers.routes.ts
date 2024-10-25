import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: { title: 'Offers for you...' },
    loadComponent: async () => (await import('./boardwalk-offers.component')).BoardwalkOffersComponent,
  },
  {
    path: ':pid',
    data: { title: 'Offers for you...' },
    loadComponent: async () => (await import('./boardwalk-offers.component')).BoardwalkOffersComponent,
  },
];
