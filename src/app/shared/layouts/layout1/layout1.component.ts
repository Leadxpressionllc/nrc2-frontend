import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DomainInfo } from '@core/models';
import { EmailDomainFooterComponent, EmailDomainHeaderComponent, FooterComponent, HeaderComponent } from '@shared/components';

@Component({
  selector: 'nrc-layout1',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent, EmailDomainHeaderComponent, EmailDomainFooterComponent],
  templateUrl: './layout1.component.html',
  styleUrls: ['./layout1.component.scss'],
})
export class Layout1Component implements OnInit {
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
