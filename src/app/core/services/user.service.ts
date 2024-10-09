import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { constants } from '@app/constant';
import { addLoader } from '@core/loader-context';
import { User } from '@core/models';
import { map, Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ) {}

  getUser(): Observable<User> {
    return this.httpClient.get<User>(constants.apiUrl.users.base, {
      context: addLoader('userLoader'),
    });
  }

  updateUser(user: User): Observable<User> {
    return this.httpClient
      .put<User>(`${constants.apiUrl.users.base}/${user.id}`, user, {
        context: addLoader('userLoader'),
      })
      .pipe(
        map((response: User) => {
          this.authService.updateLoggedInUserInfoInLocalStorage(response);
          return response;
        })
      );
  }

  trackWelcomeEmailLink(): Observable<any> {
    return this.httpClient.patch(
      constants.apiUrl.users.trackWelcomeEmail,
      {},
      {
        context: addLoader('userLoader'),
      }
    );
  }
}
