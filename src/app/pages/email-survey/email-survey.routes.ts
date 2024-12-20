import { Routes } from '@angular/router';
import { loginGuard } from '@core/guards';

export const routes: Routes = [
  {
    path: ':surveyId/:userId',
    data: { title: 'Survey for you...' },
    loadComponent: async () => (await import('./email-survey.component')).EmailSurveyComponent,
    canActivate: [loginGuard],
  },
];
