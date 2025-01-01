import { Routes } from '@angular/router';
import { loginGuard } from '@core/guards';

export const routes: Routes = [
  {
    path: '', // Temporary Route. Remove after adding the HTML/CSS
    data: { title: 'Earn Money' },
    loadComponent: async () => (await import('./listicle-page.component')).ListiclePageComponent,
  },
  {
    path: ':id',
    data: { title: 'Earn Money' },
    loadComponent: async () => (await import('./listicle-page.component')).ListiclePageComponent,
  },
  {
    path: ':id/:userId',
    data: { title: 'Earn Money' },
    loadComponent: async () => (await import('./listicle-page.component')).ListiclePageComponent,
    canActivate: [loginGuard],
  },
];
