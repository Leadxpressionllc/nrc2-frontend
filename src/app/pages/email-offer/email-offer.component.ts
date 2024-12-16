import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractOfferHelper } from '@shared/extendables';

@Component({
  selector: 'nrc-email-offer',
  imports: [],
  templateUrl: './email-offer.component.html',
  styleUrl: './email-offer.component.scss',
})
export class EmailOfferComponent extends AbstractOfferHelper implements OnInit {
  @Input() offerId!: string;
  @Input() userId!: string;

  constructor(private router: Router) {
    super();
  }

  ngOnInit(): void {
    const url = this.router.serializeUrl(this.router.createUrlTree(['/offer-redirect', this.offerId]));
    window.open(url, '_self');
  }
}
