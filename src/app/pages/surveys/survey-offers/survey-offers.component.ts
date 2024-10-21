import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { constants } from '@app/constant';
import { Offer, OfferCallBack, OfferLog, PixelAnswer, PixelQuestionAnswer, PixelQuestionSubmission, User } from '@core/models';
import { MixPanelService } from '@core/services';
import { AppService } from '@core/utility-services';
import { FooterComponent, HeaderComponent } from '@shared/components';
import { LoaderDirective } from '@shared/directives';
import { AbstractOfferHelper } from '@shared/extendables';
import { take } from 'rxjs';

@Component({
  selector: 'nrc-survey-offers',
  standalone: true,
  imports: [LoaderDirective, HeaderComponent, FooterComponent],
  templateUrl: './survey-offers.component.html',
  styleUrl: './survey-offers.component.scss',
})
export class SurveyOffersComponent extends AbstractOfferHelper implements OnInit {
  @Input('id') surveyId!: string;

  offerLink!: string;
  currentIndex: number = -1;

  surveyOffers!: Offer[];
  offerCallBack!: OfferCallBack;

  // pixelQuestionData!: PixelQuestionData;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
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
    this.offerService.getOffersBySurveyId(surveyId).subscribe((offers: Offer[]) => {
      this.surveyOffers = offers;
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

      const queryParams: Params = {
        oId: offer.id,
      };

      this.router.navigate([], {
        relativeTo: this.route,
        queryParams,
        queryParamsHandling: 'merge', // remove to replace all query params by provided
        replaceUrl: true, // replacing the current state in history
      });
    }
  }

  onPressNo(): void {
    this.offerService.logUserReturnedFromLinkoutOffer(this.surveyId).subscribe();
    this._logOfferResponse(this.surveyOffers[this.currentIndex], constants.userOfferAction.noClick);
    this._proceedToNextOffer();
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
  }

  private _loadPixelQuestions(offer: Offer): void {
    // TODO: update this code after backend refactoring
    // this.pixelQuestionData = PixelQuestionRendererMapperService.mapPixelAndOfferToPixelQuestionData(offer, offer.pixels[0], this.user);
    this.surveyOffers[this.currentIndex].showCoregOffer = true;
  }

  onSubmitPixelQuestionResponses(pixelQuestionAnswers: PixelQuestionAnswer[]): void {
    const offer = this.surveyOffers[this.currentIndex];
    const pixel = offer.pixels[0];
    // TODO: update this code after backend refactoring
    const pixelAnswers: PixelAnswer[] = []; // PixelQuestionRendererMapperService.loadPixelAnswers(pixel, pixelQuestionAnswers);

    const userDataAnswers = pixelQuestionAnswers.filter((pqa) => pqa.isUserDataQuestion);
    pixelQuestionAnswers = pixelQuestionAnswers.filter((pqa) => !pqa.isUserDataQuestion);

    const pixelQuestionResponseData: PixelQuestionSubmission = {
      answers: pixelQuestionAnswers,
      pixelAnswers,
    };

    this._logOfferResponse(this.surveyOffers[this.currentIndex], constants.userOfferAction.submit);

    this._updateUser(userDataAnswers);

    this.offerService.submitOfferPixelQuestionResponses(offer.id, pixel.id, pixelQuestionResponseData).subscribe(() => {
      this._proceedToNextOffer();
    });
  }

  private _logOfferResponse(offer: Offer, userOfferAction: string): void {
    const offerLog: OfferLog = {
      surveyId: this.surveyId,
      offerId: offer.id,
      offerPoolId: offer.offerPoolId,
      surveyPageId: offer.surveyPageId,
      surveyPageOrder: offer.surveyPageOrder,
      surveyQuestionId: offer.surveyQuestionId,
      userOfferAction,
    };
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
