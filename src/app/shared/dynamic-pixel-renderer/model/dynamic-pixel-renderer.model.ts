import { DynamicQuestion } from '@shared/dynamic-question-renderer/models';

export interface DynamicPixel {
  id: string;
  heading: string;
  description: string;
  consentText: string;
  yesButtonText: string;
  noButtonText: string;
  questions: DynamicQuestion[];
}
