import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: { title: 'Marketing Associates' },
    loadComponent: async () => (await import('./marketing-associates.component')).MarketingAssociatesComponent,
  },
];
