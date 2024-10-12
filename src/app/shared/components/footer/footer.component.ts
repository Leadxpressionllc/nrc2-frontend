import { Component, Input } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';

@Component({
  selector: 'nrc-footer',
  standalone: true,
  imports: [AngularSvgIconModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  @Input() showFooterInfo: boolean = false;
  @Input() showSurveysDisclaimer: boolean = false;
}
