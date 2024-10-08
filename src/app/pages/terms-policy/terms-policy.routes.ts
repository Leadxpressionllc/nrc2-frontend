import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'privacy-policy',
    data: { title: 'Privacy Policy' },
    loadComponent: async () => (await import('./privacy-policy/privacy-policy.component')).PrivacyPolicyComponent,
  },
  {
    path: 'terms-and-conditions',
    data: { title: 'Terms & Conditions' },
    loadComponent: async () => (await import('./terms-and-conditions/terms-and-conditions.component')).TermsAndConditionsComponent,
  },
];
