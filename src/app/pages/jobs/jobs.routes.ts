import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: { title: 'Jobs' },
    loadComponent: async () => (await import('./jobs.component')).JobsComponent,
  },
  {
    path: ':userId',
    data: { title: 'Jobs' },
    loadComponent: async () => (await import('./jobs.component')).JobsComponent,
  },
];
