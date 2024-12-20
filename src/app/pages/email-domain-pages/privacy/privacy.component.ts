import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomainInfo } from '@core/models';

@Component({
  selector: 'nrc-privacy',
  imports: [],
  templateUrl: './privacy.component.html',
  styleUrl: './privacy.component.scss',
})
export class PrivacyComponent implements OnInit {
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
