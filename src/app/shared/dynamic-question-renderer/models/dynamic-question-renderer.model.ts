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
  pixels?: DynamicPixel[];
  isUserDataQuestion?: boolean;
}

export interface DynamicQuestionOption {
  id: string;
  text: string;
  value: string;
  sortOrder: number;
  pixels?: DynamicPixel[];
}

export interface DynamicInterlinkedQuestion {
  id: string;
  surveyQuestionId: string;
  questionOptions?: string[];
  questionType?: string;
  textValue?: string;
}

export interface DynamicPixel {
  id: string;
  name: string;
  consentText: string;
}
