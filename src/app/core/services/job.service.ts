import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppService } from '../utility-services/app.service';
import { constants } from '@app/constant';
import { JobResponse } from '@core/models';
import { addLoader } from '@core/loader-context';

@Injectable({
  providedIn: 'root',
})
export class JobService {
  constructor(private http: HttpClient) {}

  getJobs(start: number, sortBy: string, query: string, location: string): Observable<JobResponse> {
    let url = `${constants.apiUrl.jobs.base}?start=${start}&sortBy=${sortBy}`;

    if (!AppService.isUndefinedOrNull(location)) {
      url += '&location=' + location;
    }

    if (!AppService.isUndefinedOrNull(query)) {
      url += '&query=' + query;
    }

    return this.http.get<JobResponse>(url, {
      context: addLoader('jobsLoader'),
    });
  }
}
