import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { constants } from '@app/constant';
import { addLoaderAndToaster } from '@core/loader-context';
import { User } from '@core/models';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private httpClient: HttpClient) {}

  updateUser(user: User): Observable<Response> {
    return this.httpClient.put<Response>(`${constants.apiUrl.users.base}/${user.id}`, user, {
      context: addLoaderAndToaster('userLoader', 'User updated successfully!'),
    });
  }
}
