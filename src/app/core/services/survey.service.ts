import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { constants } from '@app/constant';
import { addLoader } from '@core/loader-context';
import { Pixel, PixelQuestionSubmission, Survey } from '@core/models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SurveyService {
  constructor(private http: HttpClient) {}

  getLiveSurvey(): Observable<Survey> {
    return this.http.get<Survey>(constants.apiUrl.surveys.liveSurvey, {
      context: addLoader('surveyLoader'),
    });
  }

  getLiveSurveyId(): Observable<Survey> {
    return this.http.get<Survey>(constants.apiUrl.surveys.liveSurveyId, {
      context: addLoader('surveyLoader'),
    });
  }

  getSurveyById(surveyId: string): Observable<Survey> {
    return this.http.get<Survey>(constants.apiUrl.surveys.base + '/' + surveyId, {
      context: addLoader('surveyLoader'),
    });
  }

  saveSurveyResponses(surveyId: string, data: any): Observable<any> {
    const url = constants.apiUrl.surveys.base + '/' + surveyId;
    return this.http.post(url, data, {
      context: addLoader('surveyLoader'),
    });
  }

  getSurveyPixels(surveyId: string): Observable<Pixel[]> {
    return this.http.get<Pixel[]>(`${constants.apiUrl.surveys.base}/${surveyId}/pixels`, {
      context: addLoader('surveyPixelLoader'),
    });
  }

  submitSurveyPixelResponses(surveyId: string, pixelId: string, pixelQuestionSubmission: PixelQuestionSubmission): Observable<Response> {
    const url = `${constants.apiUrl.surveys.base}/${surveyId}/pixels/${pixelId}/submit-responses`;

    return this.http.post<Response>(url, pixelQuestionSubmission, {
      context: addLoader('offersLoader'),
    });
  }
}
