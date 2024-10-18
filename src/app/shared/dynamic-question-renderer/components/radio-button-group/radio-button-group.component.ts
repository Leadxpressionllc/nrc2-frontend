import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { MixPanelService } from '@core/services';
import { DynamicQuestion, DynamicQuestionOption } from '../../models';

@Component({
  selector: 'nrc-radio-button-group',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './radio-button-group.component.html',
  styleUrls: ['./radio-button-group.component.scss'],
})
export class RadioButtonGroupComponent implements OnInit {
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

  onValueSelect(option: DynamicQuestionOption): void {
    this.selectionChangeCount++;

    this.valueChange.emit({
      surveyQuestionId: this.question.surveyQuestionId,
      questionId: this.question.id,
      questionType: this.question.type,
      questionOptionsIds: [option.id],
    });

    this._sendDataToMixPanel(option);
  }

  private _sendDataToMixPanel(option: DynamicQuestionOption) {
    const mixpanelEventData = {
      question_id: this.question.id,
      question_type: this.question.type,
      question: this.question.text,
      response: option.text,
      survey_id: this.surveyId,
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
