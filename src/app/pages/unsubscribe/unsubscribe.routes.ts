import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: { title: 'Unsubscribe' },
    loadComponent: async () => (await import('./unsubscribe.component')).UnsubscribeComponent,
  },
];
