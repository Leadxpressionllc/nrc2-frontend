import { constants } from '@app/constant';
import { Pixel, PixelAnswer, PixelQuestion, PixelQuestionAnswer, User } from '@core/models';
import { AppService } from '@core/utility-services';
import { DynamicQuestion, DynamicQuestionOption } from '@shared/dynamic-question-renderer/models';
import { DynamicPixel } from '../model/dynamic-pixel-renderer.model';

export class DynamicPixelRendererMapperService {
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

    this._addUserDataQuestionsToDynamicPixel(pixel, dynamicPixel.questions, user);
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

  private static _addUserDataQuestionsToDynamicPixel(pixel: Pixel, questions: DynamicQuestion[], user: any): void {
    const { DATE, INPUT, SELECT } = constants.dynamicQuestionRenderer.questionHtmlElement;
    const pixelUrl = pixel.url;
    const pixelPayload = !AppService.isUndefinedOrNull(pixel.requestPayload) ? pixel.requestPayload : '';

    // Define an array of user data fields and their corresponding pixel URL patterns
    const userDataFields = [
      {
        field: 'dob',
        patterns: ['[AGE]', '[BIRTH_DATE]', '[BIRTH_DAY]', '[BIRTH_MONTH]', '[BIRTH_YEAR]'],
        question: 'What is your date of birth?',
        type: DATE,
      },
      {
        field: 'phone',
        patterns: ['[PHONE_NUMBER]', '[PHONE_AREA_CODE]', '[PHONE_PREFIX]', '[PHONE_SUFFIX]'],
        question: 'What is your phone number?',
        type: INPUT,
      },
      { field: 'address', patterns: ['[STREET_ADDRESS]'], question: 'What is your street address?', type: INPUT },
      { field: 'gender', patterns: ['[GENDER]', '[GENDER_FULL]'], question: 'What is your gender?', type: SELECT },
    ];

    // Iterate through user data fields
    userDataFields.forEach(({ field, patterns, question, type }) => {
      // Check if the user field is undefined or null and if any pattern matches in the pixelUrl
      if (
        AppService.isUndefinedOrNull(user[field]) &&
        patterns.some((pattern) => pixelUrl.includes(pattern) || pixelPayload.includes(pattern))
      ) {
        // Create a new question object
        const newQuestion: DynamicQuestion = {
          id: field,
          text: question,
          type: type,
          isRequired: true,
          isUserDataQuestion: true,
        };

        // Add gender-specific options if the field is 'gender'
        if (field === 'gender') {
          newQuestion.questionOptions = [
            { id: 'Male', text: 'Male', value: 'Male', sortOrder: 1 },
            { id: 'Female', text: 'Female', value: 'Female', sortOrder: 2 },
          ];
        }

        // Add the question to the questions array
        questions.push(newQuestion);
      }
    });
  }

  public static loadPixelAnswers(pixel: Pixel, pixelQuestionAnswers: PixelQuestionAnswer[]): PixelAnswer[] {
    // Create a map for faster pixel question lookup
    const pixelQuestionMap = new Map(pixel.pixelQuestions.map((pq) => [pq.question.id, pq]));

    // Use reduce to build the pixelAnswers array in a single pass
    return pixelQuestionAnswers.reduce((answers, pixelQuestionAnswer) => {
      // Lookup the pixel question using the map
      const pixelQuestion = pixelQuestionMap.get(pixelQuestionAnswer.questionId);

      // If the pixel question exists and should be added to the pixel
      if (pixelQuestion?.question.addAnswerInPixel) {
        const pixelAnswer: PixelAnswer = {
          answerLabel: pixelQuestion.question.answerLabel,
          answerType: pixelQuestion.question.answerValueType,
          answerValue: null,
        };

        // Set the answer value based on the question type
        if (pixelQuestion.question.htmlElement === constants.dynamicQuestionRenderer.questionHtmlElement.INPUT) {
          // For input type questions, use the text value
          pixelAnswer.answerValue = pixelQuestionAnswer.textValue as string;
        } else {
          // For other types, find the matching option value
          pixelAnswer.answerValue =
            pixelQuestion.question.questionOptions.find((option) => pixelQuestionAnswer.questionOptionsIds?.[0] === option.id)?.value ??
            null;
        }

        // Add the pixel answer to the array
        answers.push(pixelAnswer);
      }

      return answers;
    }, [] as PixelAnswer[]);
  }
}
