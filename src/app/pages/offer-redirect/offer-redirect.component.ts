import { Component, Input, OnInit } from '@angular/core';
import { OfferCallBack } from '@core/models';
import { AbstractOfferHelper } from '@shared/extendables';

@Component({
  selector: 'nrc-offer-redirect',
  standalone: true,
  imports: [],
  templateUrl: './offer-redirect.component.html',
  styleUrl: './offer-redirect.component.scss',
})
export class OfferRedirectComponent extends AbstractOfferHelper implements OnInit {
  fromEmail = false;

  // path params
  @Input() surveyId!: string;
  @Input() offerId!: string;
  @Input() offerPoolId!: string;

  // query params
  @Input() surveyPageId!: string;
  @Input() surveyPageOrder!: number;
  @Input() surveyQuestionId!: string;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this._loadOfferCallBack();
  }

  private _loadOfferCallBack(): void {
    const api = this.offerPoolId
      ? this.offerService.getOfferPoolCallBack(
          this.surveyId,
          this.offerPoolId,
          this.offerId,
          this.surveyPageId,
          this.surveyPageOrder,
          this.surveyQuestionId
        )
      : this.offerService.getOfferCallBack(this.offerId);

    api.subscribe((offerCallBack: OfferCallBack) => {
      const offerLink = this.getOfferLink(offerCallBack.offer, offerCallBack.user.id, offerCallBack.id);
      window.open(offerLink, '_self');
    });
  }
}
