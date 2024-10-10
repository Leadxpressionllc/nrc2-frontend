import { Component, Input } from '@angular/core';

@Component({
  selector: 'nrc-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  @Input() showFooterInfo: boolean = false;
  @Input() showSurveysDisclaimer: boolean = false;
}
