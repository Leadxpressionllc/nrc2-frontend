import { Injectable } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class ValidatorService {
  public static emailValidator(control: FormControl): { [key: string]: any } | null {
    const emailRegexp = /^["_A-Za-z0-9-\+]+(\.["_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*(\.[A-Za-z]{2,})$/i;

    if (control.value && !emailRegexp.test(control.value)) {
      return { invalidEmail: true };
    }
    return null;
  }

  public static zipCodeValidator(control: FormControl): { [key: string]: any } | null {
    let zipCode = control.value;
    if (zipCode) {
      const zipCodeRegex = /^\d{5}$/;
      zipCode = zipCode.replace(/\D/g, '');

      if (!zipCodeRegex.test(zipCode)) {
        return { zipCodePattern: true };
      }
    }
    return null;
  }

  public static phoneValidator(): any {
    return function validatePhoneNumber(control: FormControl): { [key: string]: any } | null {
      const phoneNumber = control.value;
      if (phoneNumber) {
        const PHONE_REGEXP = /^(\([0-9]{3}\) |[0-9]{3}-)[0-9]{3}-[0-9]{4}$/;

        if (!PHONE_REGEXP.test(phoneNumber)) {
          return { phoneNumberInvalid: true };
        }
      }
      return null;
    };
  }

  public static passwordValidator(control: FormControl): { [key: string]: any } | null {
    /**
     * This password regular expression validates following characters
     * {8,}: Has minimum 8 characters in length.
     * (?=.*?[A-Z]): At least one uppercase letter.
     * (?=.*?[a-z]): At least one lowercase letter.
     * (?=.*?[0-9]): At least one digit.
     * (?=.*?[#?!@$%^&*-_]): At least one special character.
     */
    const passwordRegexp = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-_]).{8,}$/;

    if (control.value && !passwordRegexp.test(control.value)) {
      return { invalidPassword: true };
    }
    return null;
  }

  public static matchWith(toControlName: string): { [key: string]: any } {
    let ctrl: FormControl;
    let toCtrl: FormControl;
    return function matchWith(control: FormControl): { [key: string]: any } | null {
      if (!control.parent) {
        return null;
      }

      if (!ctrl) {
        ctrl = control;
        toCtrl = control.parent.get(toControlName) as FormControl;

        if (!toCtrl) {
          return null;
        }

        toCtrl.valueChanges.subscribe(() => {
          ctrl.updateValueAndValidity();
        });
      }

      if (ctrl.value !== '' && toCtrl.value !== ctrl.value) {
        return {
          matchWith: true,
        };
      }
      return null;
    };
  }

  public static validatePattern(regex: string, validationMessage: string): any {
    return (control: FormControl): { [key: string]: any } | null => {
      const value = control.value;
      if (value) {
        if (!new RegExp(regex, 'i').test(value)) {
          return { invalidPattern: validationMessage };
        }
      }
      return null;
    };
  }

  public static greaterThan(target: any, label?: string, inverse?: boolean): any {
    return (control: FormControl): any => {
      const maxDate = new Date(target);
      const param = { target: label ? label : maxDate };

      const isNotGreaterThanObj = { isNotGreaterThan: { param } };
      const isGreaterThanObj = { isGreaterThan: { param } };

      if (control.value) {
        const selectedDate: Date = new Date(control.value);
        if (!isNaN(selectedDate.getTime())) {
          if (selectedDate > maxDate) {
            return inverse ? isNotGreaterThanObj : isGreaterThanObj;
          }
        }
      }
    };
  }

  public static lessThan(target: any, label?: string, inverse?: boolean): any {
    return (control: FormControl): any => {
      const minDate = new Date(target);
      const param = { target: label ? label : minDate };

      const isNotLessThanObj = { isNotLessThan: { param } };
      const isLessThanObj = { isLessThan: { param } };

      if (control.value) {
        const selectedDate: Date = new Date(control.value);
        if (!isNaN(selectedDate.getTime())) {
          if (selectedDate < minDate) {
            return inverse ? isNotLessThanObj : isLessThanObj;
          }
        }
      }
    };
  }

  public static urlValidator(control: FormControl): { [key: string]: any } | null {
    /**
     * This URL regex validates the domains and other base URLs in following format
     * [https|http|www].xxxxxxx.xxx, [https|http|www].xxxxxxx.xxx.xx,
     * [https|http|www].xxxxxxx.xx.xx
     */
    const urlRegexp = /^(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9-]{2,}(\.[a-zA-Z0-9-]{2,})(\.[a-zA-Z0-9]{2,})?$/;

    if (control.value && !urlRegexp.test(control.value)) {
      return { invalidUrl: true };
    }
    return null;
  }

  public static mergeValidators(formControl: AbstractControl, validators: ValidatorFn[]): void {
    const existingValidators = formControl.validator as ValidatorFn;
    validators.unshift(existingValidators);
    formControl.setValidators(Validators.compose(validators));
    formControl.updateValueAndValidity();
  }

  public static matchPasswordValidator(controlName: string, matchingControlName: string): any {
    return (formGroup: FormGroup): ValidatorFn | null => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors['matchWith']) {
        return null;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ matchWith: true });
      } else {
        matchingControl.setErrors(null);
      }
      return null;
    };
  }

  public static nameValidator(): { [key: string]: any } | null {
    return (control: FormControl): any => {
      const nameRegex = /^[a-zA-Z.'-\s]+$/;

      if (control.value && !nameRegex.test(control.value)) {
        return { invalidName: true };
      }
      return null;
    };
  }

  public static getNameValidators(): any[] {
    return [Validators.required, Validators.minLength(3), Validators.maxLength(50), ValidatorService.nameValidator()];
  }

  public static noWhitespaceValidator(control: FormControl) {
    return (control.value || '').trim().length ? null : { required: true };
  }
}
