import { CommonModule } from '@angular/common';
import { AfterContentInit, Component, ContentChild, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { FormControl, FormControlDirective, FormControlName, NgControl } from '@angular/forms';
import { AppService } from '@core/utility-services';
import { TranslateMessagePipe } from '@shared/pipes';
import { Subscription } from 'rxjs';

@Component({
  selector: 'nrc-form-control',
  standalone: true,
  imports: [CommonModule, TranslateMessagePipe],
  templateUrl: './form-control.component.html',
  styleUrls: ['./form-control.component.scss'],
})
export class FormControlComponent implements OnInit, AfterContentInit, OnDestroy {
  valueControl!: FormControl;

  @Input() validations: any;
  @Input() name!: string;

  @ContentChild(FormControlName) formControlName!: FormControlName;
  @ContentChild(FormControlDirective) formControl!: FormControlDirective;

  private subscription!: Subscription;

  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {}

  ngAfterContentInit(): void {
    const ngControl: NgControl = this.formControl ? this.formControl : this.formControlName;
    this.valueControl = ngControl.control as FormControl;
    const valueAccessor = ngControl.valueAccessor as any;
    const elementRef = valueAccessor?._elementRef ? valueAccessor._elementRef : valueAccessor._elRef;
    const nativeElement = elementRef.nativeElement;

    if (nativeElement.type !== 'file' && nativeElement.type !== 'select-one') {
      this.renderer.addClass(nativeElement, 'form-control');
    }

    if (!this.valueControl.disabled && (this.valueControl.dirty || this.valueControl.value)) {
      this.addClasses(nativeElement);
      if (!this.valueControl.dirty && this.valueControl.value) {
        this.valueControl.markAsDirty();
      }
    }

    this.subscription = this.valueControl.statusChanges.subscribe(() => {
      if (this.valueControl?.dirty || (this.valueControl.value && !this.valueControl.disabled)) {
        this.addClasses(nativeElement);
      }
    });
  }

  private addClasses(nativeElement: any): void {
    if (this.valueControl?.disabled) {
      this.renderer.removeClass(nativeElement, 'is-invalid');
      this.renderer.removeClass(nativeElement, 'is-valid');
    } else if (this.valueControl?.valid) {
      this.renderer.removeClass(nativeElement, 'is-invalid');

      // if formControl is optional and value of the formControl is null or empty then remove is-valid class
      if (AppService.isUndefinedOrNull(this.valueControl.value)) {
        this.renderer.removeClass(nativeElement, 'is-valid');
      } else {
        this.renderer.addClass(nativeElement, 'is-valid');
      }
    } else if (this.valueControl?.invalid) {
      this.renderer.removeClass(nativeElement, 'is-valid');
      this.renderer.addClass(nativeElement, 'is-invalid');
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
