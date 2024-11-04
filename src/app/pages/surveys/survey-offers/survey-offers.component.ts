import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { constants } from '@app/constant';
import { Offer, OfferCallBack, OfferLog, Pixel, PixelAnswer, PixelQuestionAnswer, PixelQuestionSubmission, User } from '@core/models';
import { MixPanelService, SurveyService } from '@core/services';
import { AppService } from '@core/utility-services';
import { FooterComponent, HeaderComponent } from '@shared/components';
import { LoaderDirective } from '@shared/directives';
import { DynamicPixel, DynamicPixelRendererComponent, DynamicPixelRendererMapperService } from '@shared/dynamic-pixel-renderer';
import { AbstractOfferHelper } from '@shared/extendables';
import { forkJoin, take } from 'rxjs';

@Component({
  selector: 'nrc-survey-offers',
  standalone: true,
  imports: [CommonModule, LoaderDirective, HeaderComponent, FooterComponent, DynamicPixelRendererComponent],
  templateUrl: './survey-offers.component.html',
  styleUrl: './survey-offers.component.scss',
})
export class SurveyOffersComponent extends AbstractOfferHelper implements OnInit {
  @Input('id') surveyId!: string;

  @ViewChild(DynamicPixelRendererComponent) dynamicPixelRendererComponent!: DynamicPixelRendererComponent;

  offerLink!: string;
  currentIndex: number = -1;

  surveyOffers!: Offer[];
  surveyPixels!: Pixel[];
  offerCallBack!: OfferCallBack;

  dynamicPixel!: DynamicPixel;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private surveyService: SurveyService,
    private mixPanelService: MixPanelService
  ) {
    super();
  }

  ngOnInit(): void {
    this.loadUser()
      .pipe(take(1))
      .subscribe((user: User) => {
        this._loadOffersBySurveyId(this.surveyId);
      });
  }

  private _loadOffersBySurveyId(surveyId: string): void {
    const apis = [this.surveyService.getSurveyPixels(surveyId), this.offerService.getOffersBySurveyId(surveyId)];

    forkJoin(apis).subscribe((response) => {
      this.surveyPixels = <Pixel[]>response[0];
      this.surveyOffers = <Offer[]>response[1];

      if (!AppService.isUndefinedOrNull(this.surveyPixels)) {
        const pixelOffers: any = this.surveyPixels.map((pixel) => {
          return {
            ...pixel,
            title: pixel.heading,
            offerType: 'COREG',
            showCoregOffer: false,
            pixel: pixel,
          };
        });

        this.surveyOffers = [...pixelOffers, ...this.surveyOffers];
      }

      this._proceedToNextOffer();
    });
  }

  private _proceedToNextOffer(): void {
    if (this.currentIndex === this.surveyOffers.length - 1) {
      this.router.navigate(['/offers']);
    } else {
      this.currentIndex++;
      const offer = this.surveyOffers[this.currentIndex];
      this._logOfferResponse(offer, constants.userOfferAction.impression);

      const queryParams: Params = {};
      queryParams[offer.offerType === 'LINKOUT' ? 'oId' : 'pId'] = offer.id;

      this.router.navigate([], {
        relativeTo: this.route,
        queryParams,
        // queryParamsHandling: 'merge', // uncomment to merge all query params by provided
        replaceUrl: true, // replacing the current state in history
      });
    }
  }

  onPressNo(): void {
    this.offerService.logUserReturnedFromLinkoutOffer(this.surveyId).subscribe();
    this._logOfferResponse(this.surveyOffers[this.currentIndex], constants.userOfferAction.noClick);
    this._proceedToNextOffer();
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // smooth scroll to top
    });
  }

  onPressYes(offer: Offer): void {
    this.offerService.logUserReturnedFromLinkoutOffer(this.surveyId).subscribe();

    if (offer.offerType === 'LINKOUT') {
      this._proceedToNextOffer();

      const url = this.router.serializeUrl(
        this.router.createUrlTree(['/offer-redirect', this.surveyId, offer.offerPoolId, offer.id], {
          queryParams: {
            surveyPageId: offer.surveyPageId,
            surveyPageOrder: offer.surveyPageOrder,
            surveyQuestionId: offer.surveyQuestionId,
          },
        })
      );

      window.open(url, '_blank');
    } else {
      this._logOfferResponse(this.surveyOffers[this.currentIndex], constants.userOfferAction.yesClick);
      this._loadPixelQuestions(offer);
    }

    this._sendDataToMixPanel(offer);

    window.scrollTo({
      top: 0,
      behavior: 'smooth', // smooth scroll to top
    });
  }

  private _loadPixelQuestions(offer: Offer): void {
    this.dynamicPixel = DynamicPixelRendererMapperService.mapPixelToDynamicPixel(offer.pixel, this.user);
    this.surveyOffers[this.currentIndex].showCoregOffer = true;
  }

  onSubmitPixelQuestionResponses(): void {
    if (!this.dynamicPixelRendererComponent.isFormValid()) {
      return;
    }

    let pixelQuestionAnswers: PixelQuestionAnswer[] = this.dynamicPixelRendererComponent.getDynamicPixelAnswers();

    const offer = this.surveyOffers[this.currentIndex];
    const pixel = offer.pixel;

    const pixelAnswers: PixelAnswer[] = DynamicPixelRendererMapperService.loadPixelAnswers(pixel, pixelQuestionAnswers);

    const userDataAnswers = pixelQuestionAnswers.filter((pqa) => pqa.isUserDataQuestion);
    pixelQuestionAnswers = pixelQuestionAnswers.filter((pqa) => !pqa.isUserDataQuestion);

    const pixelQuestionResponseData: PixelQuestionSubmission = {
      answers: pixelQuestionAnswers,
      pixelAnswers,
    };

    this._logOfferResponse(this.surveyOffers[this.currentIndex], constants.userOfferAction.submit);

    this._updateUser(userDataAnswers);

    this.surveyService.submitSurveyPixelResponses(this.surveyId, pixel.id, pixelQuestionResponseData).subscribe(() => {
      this._proceedToNextOffer();
    });

    window.scrollTo({
      top: 0,
      behavior: 'smooth', // smooth scroll to top
    });
  }

  private _logOfferResponse(offer: Offer, userOfferAction: string): void {
    const offerLog: OfferLog = {
      surveyId: this.surveyId,
      surveyPageId: offer.surveyPageId,
      surveyPageOrder: offer.surveyPageOrder,
      surveyQuestionId: offer.surveyQuestionId,
      userOfferAction,
    };

    if (offer.offerType === 'COREG') {
      offerLog.pixelId = offer.id;
    } else {
      (offerLog.offerId = offer.id), (offerLog.offerPoolId = offer.offerPoolId);
    }

    this.offerService.logOfferResponse(offer.id, offerLog).subscribe();
  }

  private _updateUser(userDataAnswers: PixelQuestionAnswer[]): void {
    if (AppService.isUndefinedOrNull(userDataAnswers)) {
      return;
    }

    const user: any = this.user;
    userDataAnswers.forEach((userData) => {
      if (userData.questionId === 'gender' && userData.questionOptionsIds) {
        user.gender = userData.questionOptionsIds[0];
      } else {
        user[userData.questionId] = userData.textValue;
      }
    });

    this.userService.updateUser(user).subscribe();
  }

  private _sendDataToMixPanel(offer: Offer) {
    const mixpanelEventData = {
      survey_id: this.surveyId,
      deal_id: offer.id,
      deal: offer.title,
      special_deal: offer.specialOffer,
      sponsored_deal: offer.sponsoredOffer,
      deal_category_name: offer.showCoregOffer,
      response: true,
    };

    this.mixPanelService.track('deal_response', mixpanelEventData);
  }
}
