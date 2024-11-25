import { OfferPool } from './offer-pool.models';
import { Pixel, PixelAnswer } from './pixel.models';

export interface Survey {
  id: string;
  name: string;
  description: string;
  timeToComplete: number;
  live: boolean;
  active: boolean;
  showExitSurveyButton: boolean;
  surveyType: string;
  requiredUserData: string;
  surveyFinishBtnText: string;
  surveyPages: SurveyPage[];
  surveyAnswers: SurveyAnswer[];
}

export interface SurveyPage {
  id: string;
  title: string;
  sortOrder: number;
  surveyQuestions: SurveyQuestion[];
}

export interface SurveyQuestion {
  id: string;
  sortOrder: number;
  hideQuestion: boolean;
  question: Question;
  interlinkedQuestions: InterlinkedQuestion[];
  surveyQuestionOfferPools: SurveyQuestionOfferPool[];
  surveyQuestionPixels: SurveyQuestionPixels[];
}

export interface Question {
  id: string;
  name: string;
  text: string;
  questionType: string;
  htmlElement: string;
  sortOrder: number;
  addAnswerInPixel: boolean;
  answerLabel: string;
  answerValueType: string;
  questionOptions: QuestionOption[];
}

export interface QuestionOption {
  id: string;
  text: string;
  clientQuestionOptionId: string;
  sortOrder: number;
  valueSameAsText: boolean;
  value: string;
  clearOtherOptions: boolean;
  pixels: Pixel[];
}

export interface InterlinkedQuestion {
  id: string;
  sourceSurveyQuestionId: string;
  questionOptions: QuestionOption[];
}

export interface SurveyQuestionOfferPool {
  id: string;
  questionOptionId: string;
  offerPool: OfferPool;
}

export interface SurveyQuestionPixels {
  id: string;
  pixel: Pixel;
  questionOptionId: string;
}

export interface SurveySubmissionRequest {
  answers: SurveyAnswer[];
  pixelAnswers?: PixelAnswer[];
  trustedFormUrl?: string;
}

export interface SurveyAnswer {
  surveyQuestionId: string;
  questionId: string;
  questionType: string;
  questionOptionsIds?: string[];
  textValue?: string;
}
