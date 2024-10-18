import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DynamicQuestion } from '../../models';

@Component({
  selector: 'nrc-date',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.scss'],
})
export class DateComponent implements OnInit {
  question!: DynamicQuestion;
  form!: FormGroup;

  datePickerOptions: any = { isAnimated: true, selectFromOtherMonth: true };

  valueChange!: EventEmitter<any>;

  constructor() {}

  ngOnInit(): void {
    if (this.question.id === 'dob') {
      this._setupMinMaxDatesForDob();
    }
  }

  private _setupMinMaxDatesForDob(): void {
    const todayDate = new Date();
    this.datePickerOptions.minDate = new Date(todayDate.getFullYear() - 100, 0, 1);
    todayDate.setFullYear(todayDate.getFullYear() - 18);
    this.datePickerOptions.maxDate = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate());
  }

  onDateValueChange($event: any): void {}
}
