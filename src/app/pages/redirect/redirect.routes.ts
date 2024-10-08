import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: ':userId/:pageName',
    data: { title: 'Redirecting...' },
    loadComponent: async () => (await import('./redirect.component')).RedirectComponent,
  },
];
