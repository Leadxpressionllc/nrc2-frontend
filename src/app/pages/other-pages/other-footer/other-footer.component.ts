import { Component, Input } from '@angular/core';
import { DomainInfo } from '@core/models';

@Component({
  selector: 'nrc-other-footer',
  standalone: true,
  imports: [],
  templateUrl: './other-footer.component.html',
  styleUrl: './other-footer.component.scss',
})
export class OtherFooterComponent {
  @Input() domainInfo!: DomainInfo;

  currentYear!: number;

  ngOnInit(): void {
    this.currentYear = new Date().getFullYear();
  }
}
