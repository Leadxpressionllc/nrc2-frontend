import { Component, Input } from '@angular/core';
import { MixPanelService } from '@core/services';

@Component({
  selector: 'nrc-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  @Input() showSignUpButton: boolean = false;
  @Input() showStickyAlert: boolean = false;
  @Input() showPrivacyInfoPill: boolean = false;

  constructor(private mixPanelService: MixPanelService) {}

  trackApplyButtonClicks(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.mixPanelService.track('apply_now', { cta_name: 'button_header' });
  }
}
