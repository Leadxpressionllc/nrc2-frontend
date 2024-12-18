import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '@core/services';
import { AppService, ValidatorService } from '@core/utility-services';
import { FormControlComponent } from '@shared/components';
import { LoaderDirective } from '@shared/directives';
import { AlertModule } from 'ngx-bootstrap/alert';

@Component({
  selector: 'nrc-unsubscribe',
  imports: [ReactiveFormsModule, RouterModule, AlertModule, LoaderDirective, FormControlComponent],
  templateUrl: './unsubscribe.component.html',
  styleUrl: './unsubscribe.component.scss',
})
export class UnsubscribeComponent implements OnInit {
  @Input('confirmed') showSuccessAlert = false;

  error = '';

  unsubscribeForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this._loadForm();
  }

  private _loadForm(): void {
    this.unsubscribeForm = this.fb.group({
      email: [null, [Validators.required, ValidatorService.emailValidator]],
    });
  }

  onSubmit(): void {
    this.error = '';
    this.showSuccessAlert = false;

    AppService.markAsDirty(this.unsubscribeForm);
    if (!this.unsubscribeForm.valid) {
      return;
    }

    this.authService.unsubscribeUserByEmail(this.unsubscribeForm.value.email).subscribe({
      next: (response) => {
        this.showSuccessAlert = true;
      },
      error: (error) => {
        this.error = AppService.getApiError(error);
      },
    });
  }
}
