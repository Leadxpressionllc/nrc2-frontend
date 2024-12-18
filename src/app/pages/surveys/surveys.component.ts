import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { constants } from '@app/constant';
import { Survey, User } from '@core/models';
import { AuthService, MixPanelService, OfferService, PopupService, SurveyService } from '@core/services';
import { AppService } from '@core/utility-services';
import { ConfirmationComponent, FooterComponent, HeaderComponent } from '@shared/components';
import { LoaderDirective } from '@shared/directives';
import {
  DynamicSurvey,
  DynamicSurveyRendererComponent,
  DynamicSurveyRendererMapperService,
  DynamicSurveyResponse,
} from '@shared/dynamic-survey-renderer';
import { firstValueFrom, map, tap } from 'rxjs';

@Component({
  selector: 'nrc-surveys',
  imports: [CommonModule, RouterModule, DynamicSurveyRendererComponent, LoaderDirective],
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

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private renderer: Renderer2,
    private authService: AuthService,
    private surveyService: SurveyService,
    private offerService: OfferService,
    private mixPanelService: MixPanelService,
    private popupService: PopupService
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
    } else {
      this.currentPage++;
    }
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

    window.scrollTo({
      top: 0,
      behavior: 'smooth', // smooth scroll to top
    });
  }

  private _navigationToAfterSurveyCompletionPage(): void {
    if (this.survey.surveyType === constants.surveyTypes.triggerOffersOnPageSubmit) {
      this.router.navigate(['/offers']);
    } else {
      this.router.navigate(['surveys/' + this.survey.id + '/offers']);
    }
  }

  private async _openLinkOutOffers(surveyPageResponses: DynamicSurveyResponse[]): Promise<void> {
    // Get the current page's survey questions
    const currentPageQuestions = this.survey.surveyPages[this.currentPage].surveyQuestions;

    for (const surveyQuestion of currentPageQuestions) {
      // Check if the question has offer pools
      if (AppService.isUndefinedOrNull(surveyQuestion.surveyQuestionOfferPools)) {
        continue;
      }

      // Find the corresponding survey response for this question
      const surveyResponse = surveyPageResponses.find((spr) => spr.surveyQuestionId === surveyQuestion.id);
      if (!surveyResponse) {
        continue;
      }

      for (const sqop of surveyQuestion.surveyQuestionOfferPools) {
        const offerPoolOffers = sqop.offerPool.offerPoolOffers;

        try {
          // Check if the surveyResponse includes this offer pool's option and if there are offers available
          if (offerPoolOffers.length > 0 && surveyResponse.questionOptionsIds?.includes(sqop.questionOptionId)) {
            // Get the offer ID asynchronously using await
            const offerId = await firstValueFrom(this.offerService.getOfferIdByOfferPoolId(sqop.offerPool.id));

            if (offerId) {
              this._redirectUserToOffer(offerId, sqop.offerPool.id, surveyQuestion.id);
            }
          }
        } catch (error) {
          console.error('Error fetching targeted offer', error);
        }
      }
    }

    this.currentPage++;
  }

  private _redirectUserToOffer(offerId: string, offerPoolId: string, surveyQuestionId: string) {
    const currentSurveyPage = this.survey.surveyPages[this.currentPage];

    // Create the URL for the offer redirect
    const offerRedirectUrl = this.router.serializeUrl(
      this.router.createUrlTree(['/offer-redirect', this.survey.id, offerPoolId, offerId], {
        queryParams: {
          surveyPageId: currentSurveyPage.id,
          surveyPageOrder: currentSurveyPage.sortOrder,
          surveyQuestionId: surveyQuestionId,
        },
      })
    );

    window.open(offerRedirectUrl, '_blank');
  }

  loadExternalJavascript(src: string): HTMLScriptElement {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = src;
    this.renderer.appendChild(document.body, script);
    return script;
  }

  private _loadTrustedForm(): void {
    // Define constants for the TrustedForm configuration
    const FIELD = 'xxTrustedFormCertUrl';
    const PROVIDE_REFERRER = false;
    const INVERT_FIELD_SENSITIVITY = false;

    // Determine the protocol (http or https) dynamically
    const protocol = document.location.protocol === 'https:' ? 'https' : 'http';

    // Construct the TrustedForm script URL
    const scriptUrl = new URL('https://api.trustedform.com/trustedform.js');
    scriptUrl.searchParams.append('provide_referrer', PROVIDE_REFERRER.toString());
    scriptUrl.searchParams.append('field', FIELD);
    scriptUrl.searchParams.append('l', `${Date.now()}${Math.random()}`);
    scriptUrl.searchParams.append('invert_field_sensitivity', INVERT_FIELD_SENSITIVITY.toString());

    // Load the external JavaScript and log when it's loaded
    this.loadExternalJavascript(scriptUrl.toString()).onload = () => {
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
    const { id, firstName, email, zipCode } = this.loggedInUser;

    this.mixPanelService.identify(id);

    this.mixPanelService.register({
      name: firstName,
      email: email,
      zip_code: zipCode,
    });

    this.mixPanelService.peopleSet({
      $name: firstName,
      $email: email,
      $zip_code: zipCode,
    });
  }

  showExitSurveyConfirmation(): void {
    const modalRef = this.popupService.openWithComponent(ConfirmationComponent, {
      heading: '',
      message: 'Are you sure you want to leave this survey?',
      icon: 'warning',
      yesButtonText: 'Leave this page',
      cancelButtontext: 'Stay on this page',
    });

    modalRef.eventEmitter.subscribe((result: boolean) => {
      if (result) {
        this.router.navigate(['/offers']);
      }
    });
  }
}
