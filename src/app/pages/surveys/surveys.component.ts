import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { constants } from '@app/constant';
import { Survey, User } from '@core/models';
import { AuthService, MixPanelService, OfferService, SurveyService } from '@core/services';
import { AppService } from '@core/utility-services';
import { FooterComponent, HeaderComponent } from '@shared/components';
import {
  DynamicSurvey,
  DynamicSurveyRendererComponent,
  DynamicSurveyRendererMapperService,
  DynamicSurveyResponse,
} from '@shared/dynamic-survey-renderer';
import { map, tap } from 'rxjs';

@Component({
  selector: 'nrc-surveys',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent, DynamicSurveyRendererComponent],
  templateUrl: './surveys.component.html',
  styleUrl: './surveys.component.scss',
})
export class SurveysComponent implements OnInit {
  @ViewChild('trustedFormCertUrl') trustedFormCertUrl!: ElementRef;

  survey!: Survey;

  dynamicSurvey!: DynamicSurvey;
  surveyResponses: DynamicSurveyResponse[] = [];

  currentPage: number = 0;

  isSurveyCompleted: boolean = false;
  isInitialized: boolean = false;

  loggedInUser!: User;

  steps = [
    { name: '1', completed: false },
    { name: '2', completed: false },
    { name: '4', completed: false },
    { name: '5', completed: false },
    { name: '6', completed: false },
    { name: '7', completed: false },
    { name: '8', completed: false },
  ];
  currentStep = 1;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private renderer: Renderer2,
    private authService: AuthService,
    private surveyService: SurveyService,
    private offerService: OfferService,
    private mixPanelService: MixPanelService
  ) {}

  ngOnInit(): void {
    this._loadTrustedForm();
    this.loggedInUser = <User>this.authService.getAuthInfo()?.user;

    this.route.paramMap.subscribe((paramsMap) => {
      const id = paramsMap.get('id');

      if (id) {
        if (id === 'bw') {
          // Redirect to a specific URL for 'bw' id
          const baseUrl = AppService.getWebsiteBaseUrl();
          const redirectUrl = `${baseUrl}/bw?zip=${this.loggedInUser.zipCode}&email=${this.loggedInUser.email}`;
          window.location.replace(redirectUrl);
        } else {
          // Load survey for the given id
          this._loadSurvey(id);
        }
      } else {
        // If no id is provided, get the live survey id
        this._getLiveSurveyId();
      }
    });
  }

  private _getLiveSurveyId(): void {
    this.surveyService.getLiveSurveyId().subscribe((response: any) => {
      this.router.navigate([`/surveys/${response.surveyId}`]);
    });
  }

  private _loadSurvey(surveyId: string): void {
    this.surveyService
      .getSurveyById(surveyId)
      .pipe(
        // Use map operator to transform the response
        map((response: Survey) => {
          this.survey = response;
          return DynamicSurveyRendererMapperService.mapSurveyToDynamicSurvey(this.survey);
        }),
        // Use tap operator for side effects without changing the stream
        tap((dynamicSurvey: DynamicSurvey) => {
          if (dynamicSurvey.isSurveyCompleted) {
            this._navigationToAfterSurveyCompletionPage();
          } else {
            this.dynamicSurvey = dynamicSurvey;
            this.surveyResponses = this.survey.surveyAnswers;
            this.currentPage = this.dynamicSurvey.incompletePageNumber;
            this._updateQueryParams();
            this._triggerMixpanelEvents();
          }
        })
      )
      .subscribe({
        error: (error) => {
          console.error('Error while loading survey:', error);
        },
      });
  }

  onPageSubmit(surveyPageResponses: DynamicSurveyResponse[]): void {
    if (AppService.isUndefinedOrNull(surveyPageResponses)) {
      return;
    }

    this.surveyResponses.push(...surveyPageResponses);

    const payload = {
      trustedFormUrl: this.trustedFormCertUrl.nativeElement.value,
      answers: surveyPageResponses,
    };

    // Save survey responses and handle navigation
    this.surveyService.saveSurveyResponses(this.dynamicSurvey.id, payload).subscribe({
      next: () => {
        if (this.isSurveyCompleted) {
          this._navigationToAfterSurveyCompletionPage();
        } else {
          this._updateQueryParams();
        }
      },
      error: (error) => console.error('Error saving survey responses:', error),
    });

    if (this.survey.surveyType === constants.surveyTypes.triggerOffersOnPageSubmit) {
      this.offerService.logUserReturnedFromLinkoutOffer(this.dynamicSurvey.id).subscribe();
      this._openLinkOutOffers(surveyPageResponses);
    }

    this.currentPage++;
  }

  onSubmit(surveyResponses: DynamicSurveyResponse[]): void {
    const eventData = {
      survey_id: this.dynamicSurvey.id,
      all_responses: surveyResponses,
      total_steps_completed: this.dynamicSurvey.surveyPages.length,
    };

    this.mixPanelService.track('survey_complete', eventData);
    this._sendUserDataToMixPanel();

    this.isSurveyCompleted = true;
  }

  private _updateQueryParams(): void {
    const queryParams: Params = {
      pageId: this.survey.surveyPages[this.currentPage].id,
      pageNo: this.currentPage + 1,
    };

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge', // remove to replace all query params by provided
      replaceUrl: true, // replacing the current state in history
    });
  }

  private _navigationToAfterSurveyCompletionPage(): void {
    if (this.survey.surveyType === constants.surveyTypes.triggerOffersOnPageSubmit) {
      this.router.navigate(['/offers']);
    } else {
      this.router.navigate(['surveys/' + this.survey.id + '/offers']);
    }
  }

  private _openLinkOutOffers(surveyPageResponses: DynamicSurveyResponse[]): void {
    this.survey.surveyPages[this.currentPage].surveyQuestions.forEach((surveyQuestion) => {
      if (!AppService.isUndefinedOrNull(surveyQuestion.surveyQuestionOfferPools)) {
        const surveyResponse = surveyPageResponses.find((spr) => spr.surveyQuestionId === surveyQuestion.id);

        surveyQuestion.surveyQuestionOfferPools.forEach((sqop) => {
          const offerPoolOffers = sqop.offerPool.offerPoolOffers;

          if (surveyResponse && surveyResponse.questionOptionsIds?.includes(sqop.questionOptionId) && offerPoolOffers.length > 0) {
            const index = Math.floor(Math.random() * offerPoolOffers.length);

            const url = this.router.serializeUrl(
              this.router.createUrlTree(['/offer-redirect', this.survey.id, sqop.offerPool.id, offerPoolOffers[index].offer.id], {
                queryParams: {
                  surveyPageId: this.survey.surveyPages[this.currentPage].id,
                  surveyPageOrder: this.survey.surveyPages[this.currentPage].sortOrder,
                  surveyQuestionId: surveyQuestion.id,
                },
              })
            );

            window.open(url, '_blank');
          }
        });
      }
    });
  }

  loadExternalJavascript(src: string): HTMLScriptElement {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = src;
    this.renderer.appendChild(document.body, script);
    return script;
  }

  private _loadTrustedForm(): void {
    const field = 'xxTrustedFormCertUrl';
    const provideReferrer: any = false;
    const invertFieldSensitivity: any = false;
    const scriptUrl =
      'http' +
      ('https:' === document.location.protocol ? 's' : '') +
      '://api.trustedform.com/trustedform.js?provide_referrer=' +
      escape(provideReferrer) +
      '&field=' +
      escape(field) +
      '&l=' +
      new Date().getTime() +
      Math.random() +
      '&invert_field_sensitivity=' +
      invertFieldSensitivity;

    this.loadExternalJavascript(scriptUrl).onload = () => {
      console.log('Trusted Form Script loaded.');
    };
  }

  private _triggerMixpanelEvents(): void {
    const eventData = {
      survey_id: this.dynamicSurvey.id,
      survey_name: this.dynamicSurvey.name,
      number_of_total_steps: this.dynamicSurvey.surveyPages.length,
      number_of_questions_next_step: this.dynamicSurvey.surveyPages[this.currentPage].questions.length,
      list_of_questions_next_step: this.dynamicSurvey.surveyPages[this.currentPage].questions,
    };

    this.mixPanelService.track('survey_start', eventData);
  }

  private _sendUserDataToMixPanel(): void {
    this.mixPanelService.identify(this.loggedInUser.id);

    this.mixPanelService.register({
      name: this.loggedInUser.firstName,
      email: this.loggedInUser.email,
      zip_code: this.loggedInUser.zipCode,
    });

    this.mixPanelService.peopleSet({
      $name: this.loggedInUser.firstName,
      $email: this.loggedInUser.email,
      $zip_code: this.loggedInUser.zipCode,
    });
  }
}
