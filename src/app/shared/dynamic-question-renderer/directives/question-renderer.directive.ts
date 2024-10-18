import { ComponentRef, Directive, EventEmitter, Input, OnChanges, OnInit, Output, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicQuestion } from '../models';
import {
  ButtonComponent,
  CheckboxGroupComponent,
  DateComponent,
  InputComponent,
  RadioButtonGroupComponent,
  SingleSelectDropdownComponent,
} from '../components';

const componentMapper: any = {
  INPUT: InputComponent,
  DATE: DateComponent,
  SELECT: SingleSelectDropdownComponent,
  CHECKBOX_GROUP: CheckboxGroupComponent,
  RADIO_BUTTON_GROUP: RadioButtonGroupComponent,
  BUTTON: ButtonComponent,
};

@Directive({
  selector: '[nrcDynamicQuestionRenderer]',
  standalone: true,
})
export class DynamicQuestionRendererDirective implements OnInit, OnChanges {
  @Input() form!: FormGroup;
  @Input() question!: DynamicQuestion;

  @Output() valueChange = new EventEmitter<any>();

  componentRef!: ComponentRef<any>;

  constructor(private viewContainerRef: ViewContainerRef) {}

  ngOnInit(): void {
    this.createComponent(this.question);
  }

  ngOnChanges(change: any): void {
    if (change.question && !change.question.firstChange) {
      const question = change.question.currentValue;
      this.createComponent(question);
    }
  }

  private createComponent(question: DynamicQuestion): void {
    if (this.componentRef) {
      this.componentRef.destroy();
    }

    this.componentRef = this.viewContainerRef.createComponent(componentMapper[question.type]);
    this.componentRef.instance.question = question;
    this.componentRef.instance.form = this.form;
    this.componentRef.instance.valueChange = this.valueChange;
  }
}
