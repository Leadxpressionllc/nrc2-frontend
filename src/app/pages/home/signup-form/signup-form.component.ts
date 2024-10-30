import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { constants } from '@app/constant';
import { AuthInfo, SignupFlow, SignupRequest, SignupSourceInfo } from '@core/models';
import { AuthService, MixPanelService, PopupService } from '@core/services';
import { AppService, ValidatorService } from '@core/utility-services';
import { FormControlComponent } from '@shared/components';
import { LoaderDirective } from '@shared/directives';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { map, take } from 'rxjs';
import { PasswordConfirmationPopupComponent } from './password-confirmation-popup/password-confirmation-popup.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { DataPoliciesPopupComponent } from './data-policies-popup/data-policies-popup.component';
import { AlertModule } from 'ngx-bootstrap/alert';

@Component({
  selector: 'nrc-signup-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BsDatepickerModule,
    BsDropdownModule,
    AlertModule,
    NgxMaskDirective,
    LoaderDirective,
    FormControlComponent,
    PasswordConfirmationPopupComponent,
    DataPoliciesPopupComponent,
  ],
  providers: [provideNgxMask()],
  templateUrl: './signup-form.component.html',
  styleUrl: './signup-form.component.scss',
})
export class SignupFormComponent implements OnInit {
  @Input() signUpButtonText: string = 'Check If You Qualify';
  @ViewChild('leadIdToken') leadIdToken!: ElementRef;

  isFormLoaded: boolean = false;

  error: string = '';
  surveyId!: string;

  signupFlow: SignupFlow = constants.defaultSignupFlow;
  signupForm!: FormGroup;

  queryParams: any;
  sourceInfo!: SignupSourceInfo;

  showPhoneField: boolean = false;
  showAddressField: boolean = false;
  showDobField: boolean = false;

  dobMinMaxDates!: { minDate: Date; maxDate: Date };

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private popupService: PopupService,
    private authService: AuthService,
    private mixPanelService: MixPanelService
  ) {}

  ngOnInit(): void {
    this._setupMinMaxDatesForDOB();
    this._loadQueryParams();

    this.activatedRoute.data.subscribe((data) => {
      if (data['signupFlow']) {
        this.signupFlow = data['signupFlow'];
      }

      this._initSignupFrom();
    });
  }

  private _initSignupFrom(): void {
    this.signupForm = this.fb.group({
      fullName: [null, ValidatorService.getNameValidators()],
      email: [null, [Validators.required, ValidatorService.emailValidator]],
      zipCode: [null, [Validators.required, ValidatorService.zipCodeValidator]],
    });

    this._loadDynamicFields();
    this._populateFormDataFromQueryParams();

    this.isFormLoaded = true;
  }

  private _loadDynamicFields(): void {
    if (!this.signupFlow) {
      return;
    }

    const fieldConfigs: any = {
      dob: { control: 'dob', validator: Validators.required },
      phone: { control: 'phone', validator: ValidatorService.phoneValidator },
      address: { control: 'address' },
    };

    const self: any = this;

    this.signupFlow.formFields.forEach((field) => {
      const config = fieldConfigs[field.name];
      if (config) {
        // Capitalize the first letter of the field name for dynamic property access
        const capitalizedFieldName = field.name.charAt(0).toUpperCase() + field.name.slice(1);
        self[`show${capitalizedFieldName}Field`] = true;
        this.signupForm.addControl(config.control, new FormControl(null, config.validator || null));
      }
    });
  }

  private _setupMinMaxDatesForDOB(): void {
    const todayDate = new Date();
    const minDate = new Date(todayDate.getFullYear() - 100, 0, 1);
    const maxDate = new Date(todayDate.getFullYear() - 18, todayDate.getMonth(), todayDate.getDate());

    this.dobMinMaxDates = { minDate, maxDate };
  }

  private _populateFormDataFromQueryParams(): void {
    if (AppService.isUndefinedOrNull(this.queryParams)) {
      return;
    }

    // Define mapping between form controls and query parameters
    const formControls = {
      email: 'email',
      fullName: ['firstName', 'lastName'],
      zipCode: ['zipCode', 'zip'], // Only one of them can contains the value at a time.
      address: 'address',
      phone: 'phone',
      dob: ['dobday', 'dobmonth', 'dobyear'],
    };

    Object.entries(formControls).forEach(([formField, queryParamKey]) => {
      // Check if the queryParamKey is an array (for fullName and zipCode)
      if (Array.isArray(queryParamKey)) {
        if (formField === 'dob') {
          // Handle date of birth separately
          const dobValues = queryParamKey.map((param) => this.queryParams[param]).filter((param) => !AppService.isUndefinedOrNull(param));

          if (dobValues.length === 3) {
            const dob = new Date(`${dobValues[2]}-${dobValues[1]}-${dobValues[0]}`);
            this.signupForm.get(formField)?.setValue(dob);
          }
        } else {
          // Map over the array of possible query parameters
          const value = queryParamKey
            .map((param) => this.queryParams[param])
            .filter((param) => !AppService.isUndefinedOrNull(param)) // Remove the null or undefined values
            .join(' '); // Join the remaining values with a space

          if (!AppService.isUndefinedOrNull(value)) {
            this.signupForm.get(formField)?.setValue(value);
          }
        }
      } else if (this.queryParams[queryParamKey]) {
        // For single queryParamKey, directly set the value if it exists
        this.signupForm.get(formField)?.setValue(this.queryParams[queryParamKey]);
      }
    });
  }

  private _loadQueryParams(): void {
    this.activatedRoute.queryParams
      .pipe(
        take(1),
        map((queryParams: Params) => {
          if (AppService.isUndefinedOrNull(queryParams)) {
            return;
          }

          this.queryParams = queryParams;

          const sourceInfoKeys = ['sid', 'subid1', 'subid2', 'subid3', 'subid4'];
          this.sourceInfo = sourceInfoKeys.reduce((acc: any, key: string) => {
            if (!AppService.isUndefinedOrNull(queryParams[key])) {
              acc[key] = queryParams[key];
            }
            return acc;
          }, {});

          if (!AppService.isUndefinedOrNull(queryParams['surveyId'])) {
            this.surveyId = queryParams['surveyId'];
          }
        })
      )
      .subscribe();
  }

  private _splitNameInFirstNameAndLastName(signup: SignupRequest): void {
    if (signup.fullName.trim().indexOf(' ') >= 0) {
      const names = signup.fullName.split(' ');
      signup.lastName = signup.fullName.replace(names[0], '').trim();
      signup.firstName = names[0];
    } else {
      signup.firstName = signup.fullName;
    }
  }

  onSubmit(): void {
    this.error = '';
    AppService.markAsDirty(this.signupForm);
    if (!this.signupForm.valid) {
      return;
    }

    this.mixPanelService.track('check_if_you_qualify_cta_click', { cta_name: 'button_1' });

    const formData = this.signupForm.value;

    const signup: SignupRequest = {
      ...formData,
      jornayaId: this.leadIdToken.nativeElement.value,
      dob: this.showDobField ? AppService.formatDate(formData.dob) : undefined,
      sourceInfo: this.sourceInfo ? this.sourceInfo : undefined,
    };

    this._splitNameInFirstNameAndLastName(signup);

    if (this._isNRCEmail(signup.email)) {
      this._handleNRCEmailSignup(signup);
    } else {
      this._sendSignupRequest(signup);
    }
  }

  private _handleNRCEmailSignup(signup: SignupRequest): void {
    this.popupService.openWithComponent(PasswordConfirmationPopupComponent, {}).eventEmitter.subscribe((password) => {
      if (password) {
        signup.passwordForSkipEmailValidation = password;
        this._sendSignupRequest(signup);
      }
    });
  }

  private _sendSignupRequest(signup: SignupRequest): void {
    this.authService.signup(signup).subscribe({
      next: (response: AuthInfo) => {
        this._sendDataToMixPanel(response);

        if (AppService.isUndefinedOrNull(this.surveyId)) {
          this.router.navigate(['/surveys']);
        } else {
          if (this.surveyId === 'bw') {
            const { zipCode, email } = response.user;
            window.location.href = `${AppService.getWebsiteBaseUrl()}/bw?zip=${zipCode}&email=${email}`;
          } else {
            this.router.navigate(['/surveys/' + this.surveyId]);
          }
        }
      },
      error: (error) => {
        this.error = AppService.getApiError(error);
      },
    });
  }

  private _isNRCEmail(email: string): boolean {
    return email.indexOf('@nationalresourceconnect.com') >= 0;
  }

  private _sendDataToMixPanel(response: AuthInfo): void {
    const { id, firstName, email, zipCode, dob } = response.user;

    const userData = {
      name: firstName,
      email,
      zip_code: zipCode,
      dob,
    };

    this.mixPanelService.identify(id);
    this.mixPanelService.register(userData);
    this.mixPanelService.peopleSet({
      $name: firstName,
      $email: email,
      $zip_code: zipCode,
      $dob: dob,
    });

    this.mixPanelService.track('check_if_you_qualify_click', { survey_id: this.surveyId });
  }

  openDataPoliciesPopupComponent(): void {
    this.popupService.openWithComponent(DataPoliciesPopupComponent, {});
  }
}
