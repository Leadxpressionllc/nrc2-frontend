import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomainInfo } from '@core/models';

@Component({
  selector: 'nrc-privacy',
  standalone: true,
  imports: [],
  templateUrl: './privacy.component.html',
  styleUrl: './privacy.component.scss',
})
export class PrivacyComponent implements OnInit {
  domainInfo!: DomainInfo;

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((data) => {
      if (data['domainInfo']) {
        this.domainInfo = data['domainInfo'];
      }
    });
  }
}
