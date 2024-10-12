import { Routes } from '@angular/router';
import { loginGuard } from '@core/guards';

export const routes: Routes = [
  {
    path: ':userId/:pageName',
    data: { title: 'Redirecting...' },
    loadComponent: async () => (await import('./redirect.component')).RedirectComponent,
    canActivate: [loginGuard],
  },
];
