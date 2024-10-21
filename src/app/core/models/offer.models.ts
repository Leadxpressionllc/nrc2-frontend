import { Pixel } from './pixel.models';
import { User } from './user.models';

export interface Offer {
  id: string;
  name: string;
  title: string;
  description: string;
  category: string;
  active: boolean;
  imageUrl: string;
  offerUrl: string;
  payout: number;
  specialOffer: boolean;
  offerType: string;
  sponsoredOffer: boolean;
  linkMask: boolean;
  yesButtonText: string;
  noButtonText: string;
  pixels: Pixel[];

  offerPoolId: string;
  surveyPageId: string;
  surveyPageOrder: number;
  surveyQuestionId: string;

  showCoregOffer?: boolean;
}

export interface OfferCallBack {
  id: string;
  offer: Offer;
  user: User;
}

export interface OfferLog {
  offerId: string;
  offerPoolId: string;
  surveyId: string;
  surveyPageId: string;
  surveyPageOrder: number;
  surveyQuestionId: string;
  userOfferAction: string;
}
