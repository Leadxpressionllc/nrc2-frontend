import { Component } from '@angular/core';
import { FooterComponent, HeaderComponent } from '@shared/components';

@Component({
  selector: 'nrc-terms-and-conditions',
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './terms-and-conditions.component.html',
  styleUrl: './terms-and-conditions.component.scss',
})
export class TermsAndConditionsComponent {}
