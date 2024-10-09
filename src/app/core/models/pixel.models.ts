import { Question } from './survey.models';

export interface Pixel {
  id: string;
  name: string;
  httpMethod: string;
  url: string;
  requestPayload: string;
  quotaUnit: string;
  quota: string;
  payout: number;
  consentText: string;
  pixelQuestions: PixelQuestion[];
}

export interface PixelQuestion {
  id: string;
  sortOrder: number;
  question: Question;
}

export interface PixelAnswer {
  answerLabel: string;
  answerValue: string;
  answerType: string;
}

export interface PixelQuestionSubmission {
  answers: PixelQuestionAnswer[];
  pixelAnswers: PixelAnswer[];
}

export interface PixelQuestionAnswer {
  questionId: string;
  questionType: string;
  isUserDataQuestion: boolean;
  questionOptionsIds?: string[];
  textValue?: string;
}
