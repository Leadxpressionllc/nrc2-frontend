import { Component, NgZone, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { Offer } from '@core/models';
import { MixPanelService, OfferService } from '@core/services';
import { LoaderDirective } from '@shared/directives';

@Component({
  selector: 'nrc-offers',
  imports: [LoaderDirective],
  templateUrl: './offers.component.html',
  styleUrl: './offers.component.scss',
})
export class OffersComponent implements OnInit {
  specialOffers!: Offer[];

  googleAdsLoaded: boolean = false;

  constructor(
    private router: Router,
    private ngZone: NgZone,
    private renderer: Renderer2,
    private offerService: OfferService,
    private mixPanelService: MixPanelService
  ) {}

  ngOnInit(): void {
    this._loadSpecialOffers();
    this._loadGoogleAdsScript();
  }

  private _loadSpecialOffers(): void {
    this.offerService.getSpecialOffers().subscribe((offers) => {
      this.specialOffers = offers;
    });
  }

  goToOffer(offer: Offer): void {
    this._sendDataToMixPanel(offer);

    const url = this.router.serializeUrl(this.router.createUrlTree(['/offer-redirect', offer.id]));
    window.open(url, '_blank');
  }

  private _loadGoogleAdsScript(): void {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
    script.async = true;
    this.renderer.appendChild(document.head, script);

    script.onload = () => {
      this.ngZone.run(() => {
        this.googleAdsLoaded = true;
      });
    };
  }

  private _sendDataToMixPanel(offer: Offer) {
    const mixpanelEventData = {
      program_id: offer.id,
      program_name: offer.name,
      program_type: offer.offerType,
      program_payout: offer.payout,
      program_special: offer.specialOffer,
    };
    this.mixPanelService.track('apply_now_program', mixpanelEventData);
  }
}
