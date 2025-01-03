import { DynamicQuestion } from '@shared/dynamic-question-renderer/models';

export interface DynamicSurvey {
  id: string;
  name: string;
  description: string;
  incompletePageNumber: number;
  isSurveyCompleted: boolean;
  surveyType?: string;
  requiredUserData: string;
  surveyFinishBtnText: string;
  surveyPages: DynamicSurveyPage[];
}

export interface DynamicSurveyPage {
  id: string;
  questions: DynamicQuestion[];
  totalVisibleQuestions?: number;
}

export interface DynamicSurveyResponse {
  id?: string;
  surveyQuestionId: string;
  questionId: string;
  questionType: string;
  questionOptionsIds?: string[];
  textValue?: string;
}
