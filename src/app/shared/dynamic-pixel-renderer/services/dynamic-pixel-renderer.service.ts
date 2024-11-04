import { constants } from '@app/constant';
import { PixelQuestionAnswer } from '@core/models';
import { AppService } from '@core/utility-services';
import { DynamicQuestion } from '@shared/dynamic-question-renderer/models';

export class DynamicPixelRendererService {
  public static getPixelQuestionAnswerFromSelectedValue(question: DynamicQuestion, selectedValue: any): any {
    if (!selectedValue) {
      return null;
    }

    // Destructure constants for better readability and performance
    const { SELECT, BUTTON, RADIO_BUTTON_GROUP, CHECKBOX_GROUP, DATE } = constants.dynamicQuestionRenderer.questionHtmlElement;

    const pixelQuestionAnswer: PixelQuestionAnswer = {
      questionId: question.id,
      questionType: question.type,
      isUserDataQuestion: <boolean>question.isUserDataQuestion,
    };

    switch (question.type) {
      case SELECT:
      case BUTTON:
      case RADIO_BUTTON_GROUP: {
        // For single selection types, wrap selectedValue in an array
        pixelQuestionAnswer.questionOptionsIds = [selectedValue];
        break;
      }

      case CHECKBOX_GROUP: {
        // For checkbox groups, filter and map selected options
        pixelQuestionAnswer.questionOptionsIds = selectedValue.reduce((acc: string[], value: boolean, index: number) => {
          // If value is true and questionOptions exist, add the option id to the accumulator
          if (value && question.questionOptions?.[index]?.id) {
            acc.push(question.questionOptions[index].id);
          }
          return acc;
        }, []);

        break;
      }

      case DATE: {
        pixelQuestionAnswer.textValue = AppService.formatDate(selectedValue);
        break;
      }

      default: {
        // For INPUT type, use selectedValue as textValue
        pixelQuestionAnswer.textValue = selectedValue;
        break;
      }
    }

    return pixelQuestionAnswer;
  }
}
