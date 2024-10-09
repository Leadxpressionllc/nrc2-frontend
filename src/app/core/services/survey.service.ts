import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { constants } from '@app/constant';
import { addLoader } from '@core/loader-context';
import { Survey } from '@core/models';
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
}
