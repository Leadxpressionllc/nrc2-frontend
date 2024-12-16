import { Component, Input } from '@angular/core';
import { DomainInfo } from '@core/models';

@Component({
  selector: 'nrc-email-domain-footer',
  imports: [],
  templateUrl: './email-domain-footer.component.html',
  styleUrl: './email-domain-footer.component.scss',
})
export class EmailDomainFooterComponent {
  @Input() domainInfo!: DomainInfo;

  currentYear!: number;

  ngOnInit(): void {
    this.currentYear = new Date().getFullYear();
  }
}
