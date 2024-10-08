import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SignupFormComponent } from './signup-form/signup-form.component';

@Component({
  selector: 'nrc-home',
  standalone: true,
  imports: [CommonModule, SignupFormComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
