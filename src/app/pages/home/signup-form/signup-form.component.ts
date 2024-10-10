import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormControlComponent } from '@shared/components';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'nrc-signup-form',
  standalone: true,
  imports: [BsDatepickerModule, ReactiveFormsModule, FormControlComponent],
  templateUrl: './signup-form.component.html',
  styleUrl: './signup-form.component.scss',
})
export class SignupFormComponent {}
