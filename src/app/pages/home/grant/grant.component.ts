import { Component } from '@angular/core';
import { SignupFormComponent } from '../signup-form/signup-form.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';

@Component({
  selector: 'nrc-grant',
  standalone: true,
  imports: [SignupFormComponent, FooterComponent],
  templateUrl: './grant.component.html',
  styleUrl: './grant.component.scss',
})
export class GrantComponent {}
