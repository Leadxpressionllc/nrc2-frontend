import { Component, OnInit } from '@angular/core';
import { MarketingAssociate } from '@core/models';
import { CommonService } from '@core/services';
import { FooterComponent, HeaderComponent } from '@shared/components';
import { LoaderDirective } from '@shared/directives';

@Component({
  selector: 'nrc-marketing-associates',
  standalone: true,
  imports: [LoaderDirective, HeaderComponent, FooterComponent],
  templateUrl: './marketing-associates.component.html',
  styleUrl: './marketing-associates.component.scss',
})
export class MarketingAssociatesComponent implements OnInit {
  marketingAssociates!: MarketingAssociate[];

  constructor(private commonService: CommonService) {}

  ngOnInit(): void {
    this.commonService.getMarketingAssociates().subscribe((response) => {
      this.marketingAssociates = response;
    });
  }
}
