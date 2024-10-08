import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: { title: 'Survey' },
    loadComponent: async () => (await import('./surveys.component')).SurveysComponent,
  },
  {
    path: ':id',
    data: { title: 'Survey' },
    loadComponent: async () => (await import('./surveys.component')).SurveysComponent,
  },
  {
    path: ':id/offers',
    data: { title: 'Offers' },
    loadComponent: async () => (await import('./survey-offers/survey-offers.component')).SurveyOffersComponent,
  },
];
