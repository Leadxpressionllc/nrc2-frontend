import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: { title: 'Survey' },
    loadComponent: async () => (await import('./offers.component')).OffersComponent,
  },
];
