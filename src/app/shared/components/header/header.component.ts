import { Component, Input } from '@angular/core';

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
}
