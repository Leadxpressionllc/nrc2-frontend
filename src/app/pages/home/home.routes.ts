import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: { title: 'Home' },
    loadComponent: async () => (await import('./home.component')).HomeComponent,
  },
  {
    path: 'grant',
    data: { title: 'Home' },
    loadComponent: async () => (await import('./grant/grant.component')).GrantComponent,
  },
];
