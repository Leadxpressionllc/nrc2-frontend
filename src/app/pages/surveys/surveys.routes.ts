import { Routes } from '@angular/router';
import { Layout1Component } from '@shared/layouts';

export const routes: Routes = [
  {
    path: '',
    component: Layout1Component,
    children: [
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
    ],
  },
];
