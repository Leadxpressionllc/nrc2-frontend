import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: { title: 'Main' },
    loadComponent: async () => (await import('./main/main.component')).MainComponent,
  },
  {
    path: 'terms',
    data: { title: 'Terms and Conditions' },
    loadComponent: async () => (await import('./terms/terms.component')).TermsComponent,
  },
  {
    path: 'privacy',
    data: { title: 'Privacy Policy' },
    loadComponent: async () => (await import('./privacy/privacy.component')).PrivacyComponent,
  },
];
