import { Offer } from './offer.models';

export interface ListiclePage {
  id: string;
  name: string;
  heading: string;
  description: string;
  imageUrl: string;
  active: boolean;
  offers: Offer[];
}
