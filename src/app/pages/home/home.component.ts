import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SignupFormComponent } from './signup-form/signup-form.component';
import { FooterComponent, HeaderComponent } from '@shared/components';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { AngularSvgIconModule } from 'angular-svg-icon';

@Component({
  selector: 'nrc-home',
  standalone: true,
  imports: [CommonModule, AccordionModule, AngularSvgIconModule, SignupFormComponent, FooterComponent, HeaderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
