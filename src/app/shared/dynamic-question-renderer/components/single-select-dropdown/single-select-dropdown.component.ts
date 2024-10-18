import { Component, EventEmitter } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { MixPanelService } from '@core/services';
import { DynamicQuestion } from '../../models';

@Component({
  selector: 'nrc-single-select-dropdown',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './single-select-dropdown.component.html',
  styleUrls: ['./single-select-dropdown.component.scss'],
})
export class SingleSelectDropdownComponent {
  question!: DynamicQuestion;
  form!: FormGroup;
  disable = false;

  valueChange!: EventEmitter<any>;

  surveyId!: string;
  pageNo!: string;
  selectionChangeCount: number = 0;
  pageId!: string;

  constructor(
    private route: ActivatedRoute,
    private mixPanelService: MixPanelService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.surveyId = params['id'];
    });

    this.route.queryParams.subscribe((params) => {
      this.pageNo = params['pageNo'];
      this.pageId = params['pageId'];
    });
  }

  onValueSelect($event: any): void {
    this.selectionChangeCount++;

    const options: any = [];
    let optionsText = '';

    if ($event.target.value) {
      options.push($event.target.value);

      if (this.question.questionOptions) {
        const selectedOption = this.question.questionOptions.find((option) => option.id === $event.target.value);
        if (selectedOption) {
          optionsText = selectedOption.text;
        }
      }
    }

    this.valueChange.emit({
      surveyQuestionId: this.question.surveyQuestionId,
      questionId: this.question.id,
      questionType: this.question.type,
      questionOptionsIds: options,
    });

    this._sendDataToMixPanel(optionsText);
  }

  private _sendDataToMixPanel(optionsText: string) {
    const mixpanelEventData = {
      survey_id: this.surveyId,
      question_id: this.question.id,
      question_type: this.question.type,
      question: this.question.text,
      response: optionsText,
      question_responded_to_number_times: this.selectionChangeCount,
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
