import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { MixPanelService } from '@core/services';
import { DynamicQuestion } from '../../models';

@Component({
  selector: 'nrc-checkbox-group',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './checkbox-group.component.html',
  styleUrls: ['./checkbox-group.component.scss'],
})
export class CheckboxGroupComponent implements OnInit {
  question!: DynamicQuestion;
  form!: FormGroup;
  formArray!: FormArray;
  disable = false;

  valueChange!: EventEmitter<any>;

  selectedOptions: string[] = [];

  selectedOptionLabels: string[] = [];

  surveyId!: string;
  pageNo!: string;
  pageId!: string;

  constructor(
    private route: ActivatedRoute,
    private mixPanelService: MixPanelService
  ) {}

  ngOnInit(): void {
    this.formArray = this.form.get(this.question.id) as FormArray;

    this.route.params.subscribe((params: Params) => {
      this.surveyId = params['id'];
    });

    this.route.queryParams.subscribe((params) => {
      this.pageNo = params['pageNo'];
    });

    this.form.controls[this.question.id].value.forEach((value: string, index: number) => {
      if (value && this.question.questionOptions) {
        this.selectedOptions.push(this.question.questionOptions[index].id);
      }
    });
  }

  onValueSelect($event: any, selectedOption: any): void {
    if ($event.target.checked) {
      this.selectedOptions.push(selectedOption.id);
      this.selectedOptionLabels.push(selectedOption.text);
    } else {
      this.selectedOptions.forEach((option, index) => {
        if (option === selectedOption.id) {
          this.selectedOptions.splice(index, 1);
          this.selectedOptionLabels.splice(index, 1);
          return false;
        }
        return true; // add a default return statement
      });
    }

    this.valueChange.emit({
      surveyQuestionId: this.question.surveyQuestionId,
      questionId: this.question.id,
      questionType: this.question.type,
      questionOptionsIds: this.selectedOptions,
    });

    this._sendDataToMixPanel();
  }

  private _sendDataToMixPanel(): void {
    const mixpanelEventData = {
      question_id: this.question.id,
      question_type: this.question.type,
      question: this.question.text,
      response: this.selectedOptionLabels,
      survey_id: this.surveyId,
      question_responded_to_number_times: this.selectedOptions.length,
      page_number: this.pageNo,
      page_id: this.pageId,
    };

    if (this.question.interlinkedQuestions && this.question.interlinkedQuestions.length > 0) {
      this.mixPanelService.track('additional_question_response_select_step_' + this.pageNo, mixpanelEventData);
    } else {
      this.mixPanelService.track('response_select_step_' + this.pageNo, mixpanelEventData);
    }
  }
}
