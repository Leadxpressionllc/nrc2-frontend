import { FormArray, FormControl } from '@angular/forms';
import { constants } from '@app/constant';
import { AppService } from '@core/utility-services';
import { DynamicQuestion } from '../models';

export class DynamicQuestionRendererService {
  public static isSingleFormControlQuestion(questionType: string): boolean {
    const singleFormControls = [
      constants.dynamicQuestionRenderer.questionHtmlElement.INPUT,
      constants.dynamicQuestionRenderer.questionHtmlElement.DATE,
      constants.dynamicQuestionRenderer.questionHtmlElement.SELECT,
      constants.dynamicQuestionRenderer.questionHtmlElement.BUTTON,
      constants.dynamicQuestionRenderer.questionHtmlElement.RADIO_BUTTON_GROUP,
    ];

    return singleFormControls.includes(questionType);
  }

  public static isMultiFormControlsQuestion(questionType: string): boolean {
    return questionType === constants.dynamicQuestionRenderer.questionHtmlElement.CHECKBOX_GROUP;
  }

  public static bindValidations(question: DynamicQuestion): { [key: string]: any } | null {
    if (this.isMultiFormControlsQuestion(question.type)) {
      return this.validateCheckBoxesRequired;
    }

    /* if (question.type === constants.surveyRenderer.questionHtmlElement.BUTTON) {
      return null;
    } */
    return this.required;
  }

  public static required(control: FormControl): { [key: string]: any } {
    if (AppService.isUndefinedOrNull(control.value) && typeof control.value !== 'object') {
      return { REQUIRED: true };
    }
    return {};
  }

  public static validateCheckBoxesRequired(formArray: FormArray): { [key: string]: any } | null {
    const totalSelected = formArray.controls.map((control) => control.value).reduce((prev, next) => (next ? prev + next : prev), 0);

    return totalSelected >= 1 ? null : { REQUIRED: true };
  }
}
