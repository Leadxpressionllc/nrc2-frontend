import { constants } from '@app/constant';
import { DynamicInterlinkedQuestion, DynamicQuestion } from '@shared/dynamic-question-renderer/models';
import { DynamicSurveyResponse } from '../model/dynamic-survey-renderer.model';

export class DynamicSurveyRendererService {
  public static getControlValueFromSurveyResponse(question: DynamicQuestion, surveyResponse: any): any {
    if (!surveyResponse) {
      return '';
    }

    // Destructure constants for better readability and performance
    const { SELECT, RADIO_BUTTON_GROUP } = constants.dynamicQuestionRenderer.questionHtmlElement;
    let controlValue = '';

    if (question.type === SELECT || question.type === RADIO_BUTTON_GROUP) {
      const questionOptions = surveyResponse.questionOptions;

      if (questionOptions && questionOptions[0]) {
        controlValue = questionOptions[0].id ? questionOptions[0].id : questionOptions[0];
      }
    } else {
      controlValue = surveyResponse.textValue;
    }

    return controlValue;
  }

  public static getSurveyResponseFromSelectedValue(question: DynamicQuestion, selectedValue: any): DynamicSurveyResponse {
    // Destructure constants for better readability and performance
    const { SELECT, BUTTON, RADIO_BUTTON_GROUP, CHECKBOX_GROUP } = constants.dynamicQuestionRenderer.questionHtmlElement;

    const surveyResponse: DynamicSurveyResponse = {
      surveyQuestionId: question.surveyQuestionId as string,
      questionId: question.id,
      questionType: question.type,
    };

    // Determine question options based on question type
    switch (question.type) {
      case SELECT:
      case BUTTON:
      case RADIO_BUTTON_GROUP:
        // For single selection types, wrap selectedValue in an array
        surveyResponse.questionOptionsIds = [selectedValue];
        break;

      case CHECKBOX_GROUP:
        // For checkbox groups, filter and map selected options
        surveyResponse.questionOptionsIds = selectedValue.reduce((acc: string[], value: boolean, index: number) => {
          // If value is true and questionOptions exist, add the option id to the accumulator
          if (value && question.questionOptions?.[index]?.id) {
            acc.push(question.questionOptions[index].id);
          }
          return acc;
        }, []);

        break;

      default:
        // For INPUT type, use selectedValue as textValue
        surveyResponse.textValue = selectedValue;
    }

    return surveyResponse;
  }

  public static isQuestionVisible(question: DynamicQuestion, surveyResponses: DynamicSurveyResponse[]): boolean {
    // If the question is hidden, then it is not visible
    if (question.hideQuestion) {
      return false;
    }

    // If there are no interlinked questions, the question is always visible
    if (!question.interlinkedQuestions?.length) {
      return true;
    }

    // Create a Map for faster lookup of survey responses
    const responseMap = new Map(surveyResponses.map((response) => [response.surveyQuestionId, response]));

    // Check visibility for each interlinked question
    return question.interlinkedQuestions.some((interlinkedQuestion) => {
      // Find the corresponding survey response
      const surveyResponse = responseMap.get(interlinkedQuestion.surveyQuestionId);

      // If a survey response exists, check its visibility
      return surveyResponse ? this._checkQuestionVisibility(surveyResponse, interlinkedQuestion) : false;
    });
  }

  private static _checkQuestionVisibility(surveyResponse: DynamicSurveyResponse, interlinkedQuestion: DynamicInterlinkedQuestion): boolean {
    // Destructure constants for better readability
    const { SELECT, BUTTON, RADIO_BUTTON_GROUP, CHECKBOX_GROUP } = constants.dynamicQuestionRenderer.questionHtmlElement;

    // Check if the question type is one of the types that use options
    const isOptionBasedQuestion = [CHECKBOX_GROUP, RADIO_BUTTON_GROUP, BUTTON, SELECT].includes(surveyResponse.questionType);

    // If it's not an option-based question or there are no question options, return false
    if (!isOptionBasedQuestion || !interlinkedQuestion.questionOptions?.length) {
      return false;
    }

    // Create a Set from surveyResponse.questionOptionsIds for faster lookup
    const selectedOptionsSet = new Set(surveyResponse.questionOptionsIds);

    // Check if any of the interlinked question options are in the selected options
    return interlinkedQuestion.questionOptions.some((optionId) => selectedOptionsSet.has(optionId));
  }
}
