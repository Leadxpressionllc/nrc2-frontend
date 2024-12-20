import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'nrc-email-survey',
  imports: [],
  templateUrl: './email-survey.component.html',
  styleUrl: './email-survey.component.scss',
})
export class EmailSurveyComponent implements OnInit {
  @Input() surveyId!: string;
  @Input() userId!: string;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const url = this.router.serializeUrl(this.router.createUrlTree(['/surveys', this.surveyId]));
    window.open(url, '_self');
  }
}
