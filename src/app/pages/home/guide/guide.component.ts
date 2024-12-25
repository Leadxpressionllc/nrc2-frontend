import { Component } from '@angular/core';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { SignupFormComponent } from '../signup-form/signup-form.component';

@Component({
  selector: 'nrc-guide',
  imports: [FooterComponent, SignupFormComponent],
  templateUrl: './guide.component.html',
  styleUrl: './guide.component.scss',
})
export class GuideComponent {
  trackClickAndScrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
