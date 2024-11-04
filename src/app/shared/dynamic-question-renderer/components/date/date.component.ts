import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DynamicQuestion } from '../../models';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'nrc-date',
  standalone: true,
  imports: [ReactiveFormsModule, BsDatepickerModule],
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.scss'],
})
export class DateComponent implements OnInit {
  question!: DynamicQuestion;
  form!: FormGroup;

  dobMinMaxDates!: { minDate: Date; maxDate: Date };

  valueChange!: EventEmitter<any>;

  constructor() {}

  ngOnInit(): void {
    if (this.question.id === 'dob') {
      this._setupMinMaxDatesForDOB();
    }
  }

  private _setupMinMaxDatesForDOB(): void {
    const todayDate = new Date();
    const minDate = new Date(todayDate.getFullYear() - 100, 0, 1);
    const maxDate = new Date(todayDate.getFullYear() - 18, todayDate.getMonth(), todayDate.getDate());

    this.dobMinMaxDates = { minDate, maxDate };
  }

  onDateValueChange($event: any): void {}
}
