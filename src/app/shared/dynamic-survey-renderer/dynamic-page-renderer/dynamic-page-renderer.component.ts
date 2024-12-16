import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { constants } from '@app/constant';
import { AppService } from '@core/utility-services';
import { DynamicQuestionRendererDirective } from '@shared/dynamic-question-renderer/directives';
import { DynamicQuestion, DynamicQuestionOption } from '@shared/dynamic-question-renderer/models';
import { DynamicQuestionRendererService } from '@shared/dynamic-question-renderer/services';
import { DynamicSurveyPage, DynamicSurveyResponse } from '../model';
import { DynamicSurveyRendererService } from '../services';
import { MixPanelService } from '@core/services';

@Component({
  selector: 'nrc-dynamic-page-renderer',
  imports: [ReactiveFormsModule, DynamicQuestionRendererDirective],
  templateUrl: './dynamic-page-renderer.component.html',
  styleUrls: ['./dynamic-page-renderer.component.scss'],
})
export class DynamicPageRendererComponent implements OnInit {
  @Input() form!: FormGroup;

  @Input() page!: DynamicSurveyPage;
  @Input() prevPage!: DynamicSurveyPage;

  @Input() surveyResponses!: DynamicSurveyResponse[];

  @Output() moveToNextPage: EventEmitter<any> = new EventEmitter<any>();
  @Output() consentText: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild(DynamicQuestionRendererDirective) dynamicQuestionRenderer!: DynamicQuestionRendererDirective;

  pageSurveyResponses!: DynamicSurveyResponse[];

  pageNo!: string;
  surveyId!: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private mixPanelService: MixPanelService
  ) {
    this.route.queryParams.subscribe((queryParams) => {
      this.pageNo = queryParams['pageNo'];
    });

    this.route.params.subscribe((params) => {
      this.surveyId = params['id'];
    });
  }

  ngOnInit(): void {
    if (AppService.isUndefinedOrNull(this.surveyResponses)) {
      this.surveyResponses = [];
    }

    this.pageSurveyResponses = Array.from(this.surveyResponses);
    this.createFormControls();
  }

  createFormControls(): void {
    // Iterate through each question on the current page
    this.page.questions.forEach((question) => {
      // Determine if the question should be visible based on current survey responses
      question.visible = DynamicSurveyRendererService.isQuestionVisible(question, this.surveyResponses);

      this._sendPageDataToMixPanel(question);

      if (question.visible) {
        // If the question is visible, add its form control to the form
        this._addFormControl(question);
        this._addPixelConsentText(question);
      } else {
        // If the question is not visible, remove any existing survey response for it
        this._removeSurveyResponse(question);
      }
    });

    if (!this._isAnyQuestionVisible()) {
      this.moveToNextPage.emit();
    }
  }

  private _addFormControl(question: DynamicQuestion): void {
    // Find the existing survey response for this question, if any
    const surveyResponse = this.surveyResponses.find((response) => response.questionId === question.id);

    // Check if the question type requires multiple form controls (e.g., checkboxes)
    if (DynamicQuestionRendererService.isMultiFormControlsQuestion(question.type) && question.questionOptions) {
      const controls = question.questionOptions.map((questionOption: DynamicQuestionOption) => {
        // Determine if this option was previously selected
        const selected = surveyResponse?.questionOptionsIds?.includes(questionOption.id) ?? false;

        // Create a new FormControl with the selected state
        return new FormControl(selected);
      });

      // Add a new FormArray to the form, containing all option controls and question validations
      this.form.addControl(question.id, new FormArray(controls, DynamicQuestionRendererService.bindValidations(question)));
    }
    // Check if the question type requires a single form control (e.g., text input, radio buttons)
    else if (DynamicQuestionRendererService.isSingleFormControlQuestion(question.type)) {
      // Get the control value from the existing survey response, if any
      const value = DynamicSurveyRendererService.getControlValueFromSurveyResponse(question, surveyResponse);
      this.form.addControl(question.id, this.fb.control(value, DynamicQuestionRendererService.bindValidations(question)));
    }
  }

  showInterlinkedQuestions(surveyResponse: DynamicSurveyResponse): void {
    // Use native Array.findIndex instead of lodash
    const index = this.pageSurveyResponses.findIndex((psr) => psr.questionId === surveyResponse.questionId);

    if (index === -1) {
      // If no matching response found, add the new survey response to the array
      this.pageSurveyResponses.push(surveyResponse);
    } else {
      // If a matching response exists, update it with the new survey response data
      Object.assign(this.pageSurveyResponses[index], surveyResponse);
    }

    // Only proceed if there are multiple questions
    if (this.page.questions.length <= 1) return;

    for (const question of this.page.questions) {
      // Determine if the question should be visible based on current survey responses
      question.visible = DynamicSurveyRendererService.isQuestionVisible(question, this.pageSurveyResponses);

      if (question.visible) {
        // If the question is visible and doesn't have a form control, add one
        if (!this.form.controls[question.id]) {
          this._addFormControl(question);
        }
      } else {
        // If the question is not visible, remove its form control and survey response
        this.form.removeControl(question.id);
        this._removeSurveyResponse(question);
      }
    }
  }

  /**
   * Method to remove a survey response for a given question from survey response arrays
   */
  private _removeSurveyResponse(question: DynamicQuestion): void {
    // Define a helper function to remove a response from an array
    const removeFromArray = (array: DynamicSurveyResponse[]) => {
      const index = array.findIndex((response) => response.questionId === question.id);
      if (index !== -1) {
        array.splice(index, 1);
      }
    };

    removeFromArray(this.surveyResponses);
    removeFromArray(this.pageSurveyResponses);
  }

  private _isAnyQuestionVisible(): boolean {
    return this.page.questions.filter((question) => question.visible).length > 0;
  }

  private _addPixelConsentText(question: DynamicQuestion): void {
    if (question.pixels && question.type !== constants.dynamicQuestionRenderer.questionHtmlElement.INPUT) {
      const pixelConsentText = question.pixels
        .filter((pixel) => !AppService.isUndefinedOrNull(pixel.consentText))
        .map((pixel) => pixel.consentText)
        .join('<br />');

      this.consentText.emit(pixelConsentText);
    } else {
      this.consentText.emit('');
    }
  }

  private _sendPageDataToMixPanel(question: DynamicQuestion) {
    const eventName = 'question_showed_to_user_step_' + this.pageNo;

    const object: any = {
      question_id: question.id,
      question: question.text,
      question_type: question.type,
      options: question.questionOptions,
      survey_id: this.surveyId,
      page_id: this.page.id,
    };

    if (question.interlinkedQuestions && question.interlinkedQuestions.length > 0) {
      object['additional_question'] = true;
    } else {
      object['additional_question'] = false;
    }

    this.mixPanelService.track(eventName, object);
  }
}
