import { Component, Input } from '@angular/core';
import { DomainInfo } from '@core/models';

@Component({
  selector: 'nrc-email-domain-header',
  imports: [],
  templateUrl: './email-domain-header.component.html',
  styleUrl: './email-domain-header.component.scss',
})
export class EmailDomainHeaderComponent {
  @Input() domainInfo!: DomainInfo;
}
