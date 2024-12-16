import { Component } from '@angular/core';
import { FooterComponent, HeaderComponent } from '@shared/components';

@Component({
  selector: 'nrc-privacy-policy',
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.scss',
})
export class PrivacyPolicyComponent {}
