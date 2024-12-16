import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PixelQuestionAnswer } from '@core/models';
import { DynamicQuestionRendererDirective } from '@shared/dynamic-question-renderer/directives';
import { DynamicQuestion, DynamicQuestionOption } from '@shared/dynamic-question-renderer/models';
import { DynamicQuestionRendererService } from '@shared/dynamic-question-renderer/services';
import { DynamicPixel } from './model/dynamic-pixel-renderer.model';
import { DynamicPixelRendererService } from './services/dynamic-pixel-renderer.service';

@Component({
  selector: 'nrc-dynamic-pixel-renderer',
  imports: [ReactiveFormsModule, DynamicQuestionRendererDirective],
  templateUrl: './dynamic-pixel-renderer.component.html',
  styleUrls: ['./dynamic-pixel-renderer.component.scss'],
})
export class DynamicPixelRendererComponent implements OnInit {
  @Input() dynamicPixel!: DynamicPixel;

  @ViewChild(DynamicQuestionRendererDirective) dynamicQuestionRenderer!: DynamicQuestionRendererDirective;

  pixelQuestionAnswers: PixelQuestionAnswer[] = [];
  form!: FormGroup;
  isFormReady: boolean = false;

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({});
    this.createFormControls();
    this.isFormReady = true;
  }

  ngAfterViewChecked(): void {
    // to prevent Expression has changed after it was checked Error
    this.cdr.detectChanges();
  }

  createFormControls(): void {
    this.dynamicPixel.questions.forEach((question) => {
      this._addFormControl(question);
    });
  }

  private _addFormControl(question: DynamicQuestion): void {
    // Check if the question type requires multiple form controls (e.g., checkboxes)
    if (DynamicQuestionRendererService.isMultiFormControlsQuestion(question.type) && question.questionOptions) {
      const controls = question.questionOptions.map((questionOption: DynamicQuestionOption) => {
        return new FormControl(false);
      });

      // Add a new FormArray to the form, containing all option controls and question validations
      this.form.addControl(question.id, new FormArray(controls, DynamicQuestionRendererService.bindValidations(question)));
    }
    // Check if the question type requires a single form control (e.g., text input, radio buttons)
    else if (DynamicQuestionRendererService.isSingleFormControlQuestion(question.type)) {
      this.form.addControl(question.id, this.fb.control('', DynamicQuestionRendererService.bindValidations(question)));
    }
  }

  isFormValid(): boolean {
    this.markAsDirty(this.form);
    return this.form.valid;
  }

  getDynamicPixelAnswers(): PixelQuestionAnswer[] {
    if (!this.isFormValid()) {
      return [];
    }

    this._extractPixelQuestionAnswers(this.form.value);
    return this.pixelQuestionAnswers;
  }

  private _extractPixelQuestionAnswers(selectedValues: any): void {
    // Create a map for faster question lookup
    // Key: question ID, Value: question object
    const questionMap = new Map(this.dynamicPixel.questions.map((q) => [q.id, q]));

    for (const key in selectedValues) {
      const selectedQuestion = questionMap.get(key);

      if (!selectedQuestion) {
        continue;
      }

      const pixelQuestionAnswer = DynamicPixelRendererService.getPixelQuestionAnswerFromSelectedValue(
        selectedQuestion,
        selectedValues[key]
      );

      if (pixelQuestionAnswer) {
        this.pixelQuestionAnswers.push(pixelQuestionAnswer);
      }
    }
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
}
