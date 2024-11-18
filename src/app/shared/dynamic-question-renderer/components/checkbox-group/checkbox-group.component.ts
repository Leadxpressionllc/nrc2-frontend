import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { MixPanelService } from '@core/services';
import { DynamicQuestion, DynamicQuestionOption } from '../../models';

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

  onValueSelect(event: Event, optionIndex: number, selectedOption: DynamicQuestionOption): void {
    // Cast event target to HTMLInputElement for proper typing
    const isChecked = (event.target as HTMLInputElement).checked;

    if (isChecked) {
      // Handle checkbox selection
      if (selectedOption.clearOtherOptions) {
        // Clear all selections if this option requires exclusive selection
        this.selectedOptions = [selectedOption.id];
        this.selectedOptionLabels = [selectedOption.text];

        // Reset all other form controls
        this.formArray.controls.filter((_, index) => index !== optionIndex).forEach((control) => control.setValue(false));
      } else {
        // Handle cases where other options might need clearing
        const clearableOptions = this.question.questionOptions?.filter((qo) => qo.clearOtherOptions) || [];

        // Clear any exclusive options if they exist
        if (clearableOptions.length) {
          const clearableIndices = clearableOptions
            .map((qo) => this.question.questionOptions?.findIndex((option) => option.id === qo.id))
            .filter((index) => index !== -1);

          // Update form controls for clearable options
          clearableIndices.forEach((index) => {
            if (index !== undefined) {
              this.formArray.controls[index].setValue(false);
            }
          });

          // Filter out cleared options from selections
          const clearableIds = new Set(clearableOptions.map((qo) => qo.id));
          const clearableLabels = new Set(clearableOptions.map((qo) => qo.text));

          this.selectedOptions = this.selectedOptions.filter((id) => !clearableIds.has(id));
          this.selectedOptionLabels = this.selectedOptionLabels.filter((text) => !clearableLabels.has(text));
        }

        // Add new selection
        this.selectedOptions.push(selectedOption.id);
        this.selectedOptionLabels.push(selectedOption.text);
      }
    } else {
      // Handle checkbox deselection
      const removeIndex = this.selectedOptions.indexOf(selectedOption.id);
      if (removeIndex !== -1) {
        this.selectedOptions.splice(removeIndex, 1);
        this.selectedOptionLabels.splice(removeIndex, 1);
      }
    }

    // Emit value change event with updated selections
    this.valueChange.emit({
      surveyQuestionId: this.question.surveyQuestionId,
      questionId: this.question.id,
      questionType: this.question.type,
      questionOptionsIds: this.selectedOptions,
    });

    // Send analytics data
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
