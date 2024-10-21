export interface DynamicQuestion {
  id: string;
  surveyQuestionId?: string;
  pixelQuestionId?: string;
  text: string;
  type: string;
  isRequired: boolean;
  sortOrder?: number;
  visible?: boolean;
  number?: number;
  questionOptions?: DynamicQuestionOption[];
  interlinkedQuestions?: DynamicInterlinkedQuestion[];
  pixels?: DynamicQuestionPixel[];
  isUserDataQuestion?: boolean;
}

export interface DynamicQuestionOption {
  id: string;
  text: string;
  value: string;
  sortOrder: number;
}

export interface DynamicInterlinkedQuestion {
  id: string;
  surveyQuestionId: string;
  questionOptions?: string[];
  questionType?: string;
  textValue?: string;
}

export interface DynamicQuestionPixel {
  id: string;
  name: string;
  consentText: string;
}
