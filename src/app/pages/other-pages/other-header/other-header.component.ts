import { Component, Input } from '@angular/core';
import { DomainInfo } from '@core/models';

@Component({
  selector: 'nrc-other-header',
  standalone: true,
  imports: [],
  templateUrl: './other-header.component.html',
  styleUrl: './other-header.component.scss',
})
export class OtherHeaderComponent {
  @Input() domainInfo!: DomainInfo;
}
