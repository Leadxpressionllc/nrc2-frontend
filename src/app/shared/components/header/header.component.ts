import { formatDate } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MixPanelService } from '@core/services';

@Component({
  selector: 'nrc-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  @Input() showSignUpButton: boolean = false;
  @Input() showStickyAlert: boolean = false;
  @Input() showPrivacyInfoPill: boolean = false;

  constructor(private mixPanelService: MixPanelService) {}

  get financialAidExtendedDate(): string {
    const currentDate = new Date();
    const extendedDate = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);
    return formatDate(extendedDate, 'MMM dd, yyyy', 'en-US');
  }

  trackApplyButtonClicks(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.mixPanelService.track('apply_now', { cta_name: 'button_header' });
  }
}
