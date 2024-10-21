import { Pixel, PixelAnswer, PixelQuestion, PixelQuestionAnswer, User } from '@core/models';
import { DynamicPixel } from '../model/dynamic-pixel-renderer.model';
import { DynamicQuestion, DynamicQuestionOption } from '@shared/dynamic-question-renderer/models';
import { AppService } from '@core/utility-services';
import { constants } from '@app/constant';

export class PixelQuestionRendererMapperService {
  public static mapPixelToDynamicPixel(pixel: Pixel, user: User): DynamicPixel {
    const dynamicPixel: DynamicPixel = {
      id: pixel.id,
      heading: pixel.heading,
      description: pixel.description,
      yesButtonText: pixel.yesButtonText,
      noButtonText: pixel.noButtonText,
      consentText: pixel.consentText,
      questions: this._getQuestions(pixel.pixelQuestions),
    };

    this._addUserDataQuestionsToDynamicPixel(pixel.url, dynamicPixel.questions, user);
    return dynamicPixel;
  }

  private static _getQuestions(pixelQuestions: PixelQuestion[]): DynamicQuestion[] {
    const questions: DynamicQuestion[] = [];

    pixelQuestions.forEach((pixelQuestion: PixelQuestion) => {
      questions.push({
        id: pixelQuestion.question.id,
        pixelQuestionId: pixelQuestion.id,
        text: pixelQuestion.question.text,
        type: pixelQuestion.question.htmlElement,
        isRequired: true,
        sortOrder: pixelQuestion.sortOrder,
        isUserDataQuestion: false,
        questionOptions: this._getQuestionOptions(pixelQuestion),
      });
    });

    return questions;
  }

  private static _getQuestionOptions(pixelQuestion: PixelQuestion): DynamicQuestionOption[] {
    const questionOptions: DynamicQuestionOption[] = [];

    pixelQuestion.question.questionOptions.forEach((questionOption) => {
      questionOptions.push({
        id: questionOption.id,
        text: questionOption.text,
        value: questionOption.value,
        sortOrder: questionOption.sortOrder,
      });
    });

    return questionOptions;
  }

  private static _addUserDataQuestionsToDynamicPixel(pixelUrl: string, questions: DynamicQuestion[], user: User): void {
    if (
      AppService.isUndefinedOrNull(user.dob) &&
      (pixelUrl.indexOf('[AGE]') >= 0 ||
        pixelUrl.indexOf('[BIRTH_DATE]') >= 0 ||
        pixelUrl.indexOf('[BIRTH_DAY]') >= 0 ||
        pixelUrl.indexOf('[BIRTH_MONTH]') >= 0 ||
        pixelUrl.indexOf('[BIRTH_YEAR]') >= 0)
    ) {
      questions.push({
        id: 'dob',
        text: 'What is your date of birth?',
        type: constants.dynamicQuestionRenderer.questionHtmlElement.DATE,
        isRequired: true,
        isUserDataQuestion: true,
      });
    }

    if (
      AppService.isUndefinedOrNull(user.phone) &&
      (pixelUrl.indexOf('[PHONE_NUMBER]') >= 0 ||
        pixelUrl.indexOf('[PHONE_AREA_CODE]') >= 0 ||
        pixelUrl.indexOf('[PHONE_PREFIX]') >= 0 ||
        pixelUrl.indexOf('[PHONE_SUFFIX]') >= 0)
    ) {
      questions.push({
        id: 'phone',
        text: 'What is your phone number?',
        type: constants.dynamicQuestionRenderer.questionHtmlElement.INPUT,
        isRequired: true,
        isUserDataQuestion: true,
      });
    }

    if (AppService.isUndefinedOrNull(user.address) && pixelUrl.indexOf('[STREET_ADDRESS]') >= 0) {
      questions.push({
        id: 'address',
        text: 'What is your street address?',
        type: constants.dynamicQuestionRenderer.questionHtmlElement.INPUT,
        isRequired: true,
        isUserDataQuestion: true,
      });
    }

    if (AppService.isUndefinedOrNull(user.gender) && (pixelUrl.indexOf('[GENDER]') >= 0 || pixelUrl.indexOf('[GENDER_FULL]') >= 0)) {
      questions.push({
        id: 'gender',
        text: 'What is your gender?',
        type: constants.dynamicQuestionRenderer.questionHtmlElement.SELECT,
        isRequired: true,
        isUserDataQuestion: true,
        questionOptions: [
          {
            id: 'Male',
            text: 'Male',
            value: 'Male',
            sortOrder: 1,
          },
          {
            id: 'Female',
            text: 'Female',
            value: 'Female',
            sortOrder: 2,
          },
        ],
      });
    }
  }

  public static loadPixelAnswers(pixel: Pixel, pixelQuestionAnswers: PixelQuestionAnswer[]): PixelAnswer[] {
    const pixelAnswers: PixelAnswer[] = [];
    pixelQuestionAnswers.forEach((pixelQuestionResponse) => {
      const pixelQuestion = pixel.pixelQuestions.find((pq) => pq.question.id === pixelQuestionResponse.questionId);
      if (!pixelQuestion) {
        return;
      }

      if (pixelQuestion.question.addAnswerInPixel) {
        const pixelAnswer: PixelAnswer = {
          answerLabel: pixelQuestion.question.answerLabel,
          answerType: pixelQuestion.question.answerValueType,
          answerValue: null,
        };

        if (pixelQuestion.question.htmlElement === constants.dynamicQuestionRenderer.questionHtmlElement.INPUT) {
          pixelAnswer.answerValue = <string>pixelQuestionResponse.textValue;
        } else {
          pixelQuestion.question.questionOptions.forEach((questionOption) => {
            if (pixelQuestionResponse.questionOptionsIds && questionOption.id === pixelQuestionResponse.questionOptionsIds[0]) {
              pixelAnswer.answerValue = questionOption.value;
              return;
            }
          });
        }

        pixelAnswers.push(pixelAnswer);
      }
    });
    return pixelAnswers;
  }
}
