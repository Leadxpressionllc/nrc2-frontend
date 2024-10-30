import { Component } from '@angular/core';
import { SignupFormComponent } from '@pages/home/signup-form/signup-form.component';
import { OtherHeaderComponent } from '../other-header/other-header.component';
import { OtherFooterComponent } from '../other-footer/other-footer.component';

@Component({
  selector: 'nrc-main',
  standalone: true,
  imports: [SignupFormComponent, OtherHeaderComponent, OtherFooterComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent {}
