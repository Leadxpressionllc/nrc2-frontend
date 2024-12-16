import { formatDate } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { MixPanelService } from '@core/services';
import { filter } from 'rxjs';

@Component({
  selector: 'nrc-header',
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  @Input() showSignUpButton: boolean = false;
  @Input() showStickyAlert: boolean = false;
  @Input() showPrivacyInfoPill: boolean = false;

  surveyId!: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private mixPanelService: MixPanelService
  ) {}

  get financialAidExtendedDate(): string {
    const currentDate = new Date();
    const extendedDate = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);
    return formatDate(extendedDate, 'MMM dd, yyyy', 'en-US');
  }

  ngOnInit(): void {
    // Listen to navigation events
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this._readSurveyIdParam();
    });

    this._readSurveyIdParam();
  }

  private _readSurveyIdParam(): void {
    this.route.params.subscribe((params) => {
      const surveyId = params['id'];
      if (surveyId) {
        this.surveyId = surveyId;
      }
    });

    this.route.firstChild?.params.subscribe((params) => {
      const surveyId = params['id'];
      if (surveyId) {
        this.surveyId = surveyId;
      }
    });

    this.route.queryParams.subscribe((queryParams) => {
      const surveyId = queryParams['surveyId'];
      if (!this.surveyId && surveyId) {
        this.surveyId = surveyId;
      }
    });
  }

  trackApplyButtonClicks(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.mixPanelService.track('apply_now', { cta_name: 'button_header' });
  }
}
