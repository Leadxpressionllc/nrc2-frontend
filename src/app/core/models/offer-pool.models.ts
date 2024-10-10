import { Offer } from './offer.models';

export interface OfferPool {
  id: string;
  name: string;
  offerCategoryId: string;
  offerCategoryName: string;
  offerPoolOffers: OfferPoolOffer[];
}

export interface OfferPoolOffer {
  id: string;
  sortOrder: number;
  offer: Offer;
}
