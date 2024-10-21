import { constants } from '@app/constant';
import { PixelQuestionAnswer } from '@core/models';
import { AppService } from '@core/utility-services';
import { DynamicQuestion } from '@shared/dynamic-question-renderer/models';

export class PixelQuestionRendererService {
  public static getPixelQuestionAnswerFromSelectedValue(question: DynamicQuestion, selectedValue: any): any {
    const pixelQuestionAnswer: PixelQuestionAnswer = {
      questionId: question.id,
      questionType: question.type,
      isUserDataQuestion: <boolean>question.isUserDataQuestion,
    };

    switch (question.type) {
      case constants.dynamicQuestionRenderer.questionHtmlElement.SELECT:
      case constants.dynamicQuestionRenderer.questionHtmlElement.BUTTON:
      case constants.dynamicQuestionRenderer.questionHtmlElement.RADIO_BUTTON_GROUP: {
        if (AppService.isUndefinedOrNull(selectedValue)) {
          return null;
        }
        pixelQuestionAnswer.questionOptionsIds = [];
        pixelQuestionAnswer.questionOptionsIds.push(selectedValue);
        break;
      }

      case constants.dynamicQuestionRenderer.questionHtmlElement.CHECKBOX_GROUP: {
        const selectedOptionIds = selectedValue
          .map((value: boolean, index: number) => (value ? question.questionOptions && question.questionOptions[index].id : null))
          .filter((v: string) => v !== null);

        if (AppService.isUndefinedOrNull(selectedOptionIds)) {
          return null;
        }

        pixelQuestionAnswer.questionOptionsIds = selectedOptionIds;
        break;
      }

      case constants.dynamicQuestionRenderer.questionHtmlElement.DATE: {
        pixelQuestionAnswer.textValue = AppService.formatDate(selectedValue);
        break;
      }

      default: {
        if (AppService.isUndefinedOrNull(selectedValue)) {
          return null;
        }
        pixelQuestionAnswer.textValue = selectedValue;
        break;
      }
    }

    return pixelQuestionAnswer;
  }
}
