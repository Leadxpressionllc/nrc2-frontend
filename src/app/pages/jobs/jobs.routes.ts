import { Routes } from '@angular/router';
import { authGuard, loginGuard } from '@core/guards';

export const routes: Routes = [
  {
    path: '',
    data: { title: 'Jobs' },
    loadComponent: async () => (await import('./jobs.component')).JobsComponent,
    canActivate: [authGuard],
  },
  {
    path: ':userId',
    data: { title: 'Jobs' },
    loadComponent: async () => (await import('./jobs.component')).JobsComponent,
    canActivate: [loginGuard],
  },
];
