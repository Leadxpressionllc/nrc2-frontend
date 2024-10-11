import { Component } from '@angular/core';
import { FooterComponent } from '@shared/components';

@Component({
  selector: 'nrc-survey-offers',
  standalone: true,
  imports: [FooterComponent],
  templateUrl: './survey-offers.component.html',
  styleUrl: './survey-offers.component.scss',
})
export class SurveyOffersComponent {}
