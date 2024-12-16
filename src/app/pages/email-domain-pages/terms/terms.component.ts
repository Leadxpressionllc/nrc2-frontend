import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomainInfo } from '@core/models';

@Component({
  selector: 'nrc-terms',
  imports: [],
  templateUrl: './terms.component.html',
  styleUrl: './terms.component.scss',
})
export class TermsComponent implements OnInit {
  domainInfo!: DomainInfo;

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.parent?.data.subscribe((data) => {
      if (data['domainInfo']) {
        this.domainInfo = data['domainInfo'];
      }
    });
  }
}
