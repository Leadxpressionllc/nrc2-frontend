import { AfterViewChecked, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { constants } from '@app/constant';
import { DynamicPageRendererComponent } from './dynamic-page-renderer/dynamic-page-renderer.component';
import { DynamicSurvey, DynamicSurveyResponse } from './model/dynamic-survey-renderer.model';
import { DynamicSurveyRendererService } from './services/dynamic-survey-renderer.service';
import { MixPanelService } from '@core/services';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'nrc-dynamic-survey-renderer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DynamicPageRendererComponent],
  templateUrl: './dynamic-survey-renderer.component.html',
  styleUrls: ['./dynamic-survey-renderer.component.scss'],
})
export class DynamicSurveyRendererComponent implements OnInit, AfterViewChecked {
  @Input() dynamicSurvey!: DynamicSurvey;
  @Input() surveyResponses: DynamicSurveyResponse[] = [];
  @Input() isSurveyCompleted: Boolean = false;

  @ViewChild(DynamicPageRendererComponent) dynamicPageRenderer!: DynamicPageRendererComponent;

  @Output() completeSurvey = new EventEmitter<any>();
  @Output() nextPage = new EventEmitter<any>();

  pageResponses: DynamicSurveyResponse[] = [];

  form!: FormGroup;

  surveyPageLoaded = false;
  currentPage = 0;
  totalPages = 0;

  perPageProgress = 0;
  surveyProgress = 0;
  pixelConsentText = '';

  steps = [
    { name: '1', completed: false },
    { name: '2', completed: false },
    { name: '4', completed: false },
    { name: '5', completed: false },
    { name: '6', completed: false },
    { name: '7', completed: false },
    { name: '8', completed: false },
  ];
  currentStep = 1;

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private mixPanelService: MixPanelService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({});
    this.totalPages = this.dynamicSurvey.surveyPages.length - 1;
    this.perPageProgress = Math.floor(100 / this.dynamicSurvey.surveyPages.length);
    this.currentPage = this.dynamicSurvey.incompletePageNumber;
    this.surveyProgress = this.currentPage * this.perPageProgress;
    this.surveyPageLoaded = true;
  }

  moveToNextPage(event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    this.markAsDirty(this.form);
    if (!this.form.valid) {
      return;
    }

    this._extractSurveyAnswers(this.form.value);
    this.surveyPageLoaded = false;

    this._sendSurveyPageResponseDataToMixPanel();

    // Check if this is the last page
    const isLastPage = this.currentPage === this.totalPages;

    if (isLastPage) {
      // Handle survey completion
      this.surveyProgress = 100;
      this.completeSurvey.emit(this.surveyResponses);
    } else {
      // Move to next page
      this.surveyProgress += this.perPageProgress;
      this.form = this.fb.group({}); // Reset form
      this.currentPage++;
    }

    // Emit next page event
    this.nextPage.emit(this.pageResponses);

    if (!isLastPage) {
      setTimeout(() => (this.surveyPageLoaded = true), 1);
    }
  }

  moveToPreviousPage(): void {
    if (this.currentPage > 0) {
      this.surveyPageLoaded = false;

      this.form = this.fb.group({});
      this.currentPage--;
      this.surveyProgress -= this.perPageProgress;

      setTimeout(() => {
        this.surveyPageLoaded = true;
      }, 1);
    }
  }

  private _clearSurvey(): void {
    this.form = this.fb.group({});
    this.surveyResponses = [];
    this.currentPage = 0;
  }

  markAsDirty(group: FormGroup): void {
    group.markAsDirty();

    for (const i in group.controls) {
      if (group.controls[i] instanceof FormControl || group.controls[i] instanceof FormArray) {
        group.controls[i].markAsDirty();
        group.controls[i].setErrors(group.controls[i].errors);
      }
    }

    setTimeout(() => {
      const element: any = document.getElementsByClassName('form-control ng-dirty ng-invalid');
      if (element && element.length > 0) {
        element[0].focus();
      }
    }, 100);
  }

  private _extractSurveyAnswers(selectedValues: any): void {
    this.pageResponses = [];
    const currentPageQuestions = this.dynamicSurvey.surveyPages[this.currentPage].questions;

    // Create a map for faster question lookup
    // Key: question ID, Value: question object
    const questionMap = new Map(currentPageQuestions.map((q) => [q.id, q]));

    // Iterate through selected values
    Object.entries(selectedValues).forEach(([key, value]) => {
      // Get the selected question using the map
      const selectedQuestion = questionMap.get(key);

      if (selectedQuestion) {
        const surveyResponse = DynamicSurveyRendererService.getSurveyResponseFromSelectedValue(selectedQuestion, value);

        if (surveyResponse) {
          // Find existing response index
          const existingIndex = this.surveyResponses.findIndex((r) => r.questionId === selectedQuestion.id);

          if (existingIndex !== -1) {
            // set the id for existing response
            surveyResponse.id = this.surveyResponses[existingIndex].id;
            this.surveyResponses[existingIndex] = surveyResponse;
          } else {
            // Add new response
            this.surveyResponses.push(surveyResponse);
          }

          this.pageResponses.push(surveyResponse);
        }
      }
    });
  }

  showButton(): boolean {
    if (
      this.dynamicSurvey.surveyPages[this.currentPage].questions.length === 1 &&
      this.dynamicSurvey.surveyPages[this.currentPage].questions[0].type === constants.dynamicQuestionRenderer.questionHtmlElement.BUTTON
    ) {
      return false;
    }

    return true;
  }

  setConsentText(consentText: string): void {
    this.pixelConsentText = consentText;
  }

  ngAfterViewChecked(): void {
    // to prevent Expression has changed after it was checked Error
    this.cdr.detectChanges();
  }

  private _sendSurveyPageResponseDataToMixPanel(): void {
    const currentPage = this.dynamicSurvey.surveyPages[this.currentPage];

    // Create a Map of questions for O(1) lookup time
    // Key: question ID, Value: question object
    const questionMap = new Map(currentPage.questions.map((q) => [q.id, q]));

    // Process page responses and build survey question results
    const surveyQuestionResults = this.pageResponses.reduce((results, response) => {
      const question = questionMap.get(response.questionId);
      if (question) {
        // Create a Map of question options for fast lookup
        // Key: option ID, Value: option text
        const optionMap = new Map(question.questionOptions?.map((opt) => [opt.id, opt.text]) || []);

        // Map selected option IDs to their text values
        // Filter out any undefined values (in case of invalid option IDs)
        const selectedOptions = response.questionOptionsIds?.map((id) => optionMap.get(id)).filter(Boolean) || [];

        results.push({
          questionText: question.text,
          selectedOptions,
          textValue: response.textValue,
        });
      }
      return results;
    }, [] as any[]);

    const surveyResults = {
      survey_id: this.dynamicSurvey.id,
      current_step_responses: surveyQuestionResults,
      number_of_questions_next_step: currentPage.questions.length,
      list_of_questions_next_step: currentPage.questions,
    };

    this.mixPanelService.track(`next_click_step_${this.currentPage + 1}`, surveyResults);
  }
}
