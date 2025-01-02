import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { constants } from '@app/constant';
import { addLoader } from '@core/loader-context';
import { ListiclePage } from '@core/models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ListiclePageService {
  constructor(private http: HttpClient) {}

  getListiclePageById(listiclePageId: string): Observable<ListiclePage> {
    return this.http.get<ListiclePage>(`${constants.apiUrl.listiclePages.base}/${listiclePageId}`, {
      context: addLoader('listiclePageLoader'),
    });
  }
}
