import { Component } from '@angular/core';
import { FooterComponent, HeaderComponent } from '@shared/components';

@Component({
  selector: 'nrc-marketing-associates',
  standalone: true,
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './marketing-associates.component.html',
  styleUrl: './marketing-associates.component.scss',
})
export class MarketingAssociatesComponent {}
