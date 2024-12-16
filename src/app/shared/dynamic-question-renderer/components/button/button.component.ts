import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DynamicQuestion } from '../../models';

@Component({
  selector: 'nrc-button',
  imports: [ReactiveFormsModule],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent implements OnInit {
  question!: DynamicQuestion;
  form!: FormGroup;
  disable = false;

  valueChange!: EventEmitter<any>;

  constructor() {}

  ngOnInit(): void {}

  onValueSelect(option: any): void {
    this.form.controls[this.question.id].setValue(option);
    this.form.controls[this.question.id].setErrors(null);

    this.valueChange.emit({
      surveyQuestionId: this.question.surveyQuestionId,
      questionId: this.question.id,
      questionType: this.question.type,
      questionOptionsIds: [option],
    });
  }
}
