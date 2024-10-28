import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { constants } from '@app/constant';
import { addLoader } from '@core/loader-context';
import { Offer, OfferCallBack, OfferLog } from '@core/models';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OfferService {
  constructor(private http: HttpClient) {}

  getOffersBySurveyId(surveyId: string): Observable<Offer[]> {
    return this.http.get<Offer[]>(`${constants.apiUrl.offers.bySurveyId}/${surveyId}`, {
      context: addLoader('offersLoader'),
    });
  }

  getSpecialOffers(): Observable<Offer[]> {
    return this.http.get<Offer[]>(constants.apiUrl.offers.specialOffers, {
      context: addLoader('offersLoader'),
    });
  }

  getOfferById(offerId: string): Observable<Offer> {
    return this.http.get<Offer>(`${constants.apiUrl.offers.base}/${offerId}`, {
      context: addLoader('offerLoader'),
    });
  }

  getOfferCallBack(offerId: string): Observable<OfferCallBack> {
    const url = `${constants.apiUrl.offers.base}/${offerId}/callback`;
    return this.http.get<OfferCallBack>(url, {
      context: addLoader('offerCallBackLoader'),
    });
  }

  getOfferPoolCallBack(
    surveyId: string,
    offerPoolId: string,
    offerId: string,
    surveyPageId: string,
    surveyPageOrder: number,
    surveyQuestionId: string
  ): Observable<OfferCallBack> {
    const url = `${constants.apiUrl.offers.base}/${offerId}/offer-pools/${offerPoolId}/${surveyId}/callback`;

    const params = {
      surveyPageId: surveyPageId,
      surveyPageOrder: surveyPageOrder,
      surveyQuestionId: surveyQuestionId,
    };

    return this.http.get<OfferCallBack>(url, {
      params,
      context: addLoader('offerCallBackLoader'),
    });
  }

  logOfferResponse(offerId: string, offerLog: OfferLog): Observable<Response> {
    const url = `${constants.apiUrl.offers.base}/${offerId}/log-response`;

    return this.http.post<Response>(url, offerLog, {
      context: addLoader('logResponseLoader'),
    });
  }

  logUserReturnedFromLinkoutOffer(surveyId: string): Observable<Response> {
    const url = `${constants.apiUrl.offers.logUserReturnedFromLinkoutOffer}/${surveyId}`;

    return this.http.get<Response>(url, {
      context: addLoader('logResponseLoader'),
    });
  }

  getRandomOfferIdByOfferPoolId(offerPoolId: string): Observable<string> {
    return this.http
      .get<{ offerId: string }>(`${constants.apiUrl.offers.randomOfferIdByOfferPoolId}/${offerPoolId}`, {
        context: addLoader('offersLoader'),
      })
      .pipe(
        map((data: { offerId: string }) => {
          return data['offerId'];
        })
      );
  }
}
