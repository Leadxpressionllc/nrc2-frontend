import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';
import { DynamicQuestion } from '../../models';

@Component({
  selector: 'nrc-input',
  standalone: true,
  imports: [ReactiveFormsModule, NgxMaskDirective],
  templateUrl: './input.component.html',
})
export class InputComponent implements OnInit {
  question!: DynamicQuestion;
  form!: FormGroup;

  valueChange!: EventEmitter<any>;

  constructor() {}

  ngOnInit(): void {}

  onTextValueChange($event: any): void {
    this.valueChange.emit({
      surveyQuestionId: this.question.surveyQuestionId,
      questionId: this.question.id,
      questionType: this.question.type,
      textValue: $event.target.value,
    });
  }
}
