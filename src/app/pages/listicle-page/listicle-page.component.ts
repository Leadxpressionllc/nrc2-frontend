import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ListiclePage, Offer } from '@core/models';
import { ListiclePageService } from '@core/services';
import { LoaderDirective } from '@shared/directives';
import { AbstractOfferHelper } from '@shared/extendables';

@Component({
  selector: 'nrc-listicle-page',
  imports: [LoaderDirective],
  templateUrl: './listicle-page.component.html',
  styleUrl: './listicle-page.component.scss',
})
export class ListiclePageComponent extends AbstractOfferHelper implements OnInit {
  @Input('id') listiclePageId!: string;

  listiclePage!: ListiclePage;

  constructor(
    private router: Router,
    private listiclePageService: ListiclePageService
  ) {
    super();
  }

  ngOnInit(): void {
    this._loadListiclePage();
  }

  private _loadListiclePage(): void {
    this.listiclePageService.getListiclePageById(this.listiclePageId).subscribe({
      next: (listiclePage: ListiclePage) => {
        this.listiclePage = listiclePage;
      },
    });
  }

  onClickOffer(offer: Offer): void {
    let url = offer.offerUrl;

    if (this.authService.isAuthenticated()) {
      url = this.router.serializeUrl(this.router.createUrlTree(['/offer-redirect', offer.id]));
    }

    window.open(url, '_blank');
  }
}
