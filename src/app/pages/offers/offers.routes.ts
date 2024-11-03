import { Routes } from '@angular/router';
import { Layout1Component } from '@shared/layouts';

export const routes: Routes = [
  {
    path: '',
    component: Layout1Component,
    children: [
      {
        path: '',
        data: { title: 'Offers' },
        loadComponent: async () => (await import('./offers.component')).OffersComponent,
      },
    ],
  },
];
