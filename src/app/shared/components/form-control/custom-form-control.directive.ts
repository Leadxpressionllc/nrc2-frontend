import { Directive, ElementRef, Injector, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ControlContainer, ControlValueAccessor, FormControl } from '@angular/forms';

@Directive()
export abstract class CustomFormControlDirective implements OnInit, ControlValueAccessor {
  @ViewChild('native', { static: true }) _elementRef!: ElementRef;

  @Input() formControlName!: string;
  @Input() disabled!: boolean;
  @Input() readonly!: string;
  @Input() placeholder!: string;

  formControl!: FormControl;
  controlContainer: ControlContainer;
  renderer: Renderer2;
  onChange: any;
  onTouched: any;
  placeholderCopy!: string;

  constructor(injector: Injector) {
    this.controlContainer = injector.get(ControlContainer);
    this.renderer = injector.get(Renderer2);
  }

  ngOnInit(): void {
    if (this.controlContainer) {
      if (this.formControlName) {
        this.formControl = this.controlContainer?.control?.get(this.formControlName) as FormControl;
      } else {
        console.warn('Missing FormControlName directive from host element of the component');
      }
    } else {
      console.warn("Can't find parent FormGroup directive");
    }
    this.placeholderCopy = this.placeholder;
  }

  writeValue(obj: any): void {}

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
