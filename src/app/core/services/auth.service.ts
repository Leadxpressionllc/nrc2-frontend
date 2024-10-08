import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { constants } from '@app/constant';
import { JwtHelperService } from '@auth0/angular-jwt';
import { addLoader } from '@core/loader-context';
import { User } from '@core/models';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthInfo, LoggedInUser, SignupRequest } from '../models/auth.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private authInfoSubject: BehaviorSubject<AuthInfo>;

  private jwtHelper: JwtHelperService = new JwtHelperService();

  constructor(
    private httpClient: HttpClient,
    private injector: Injector
  ) {
    this.authInfoSubject = new BehaviorSubject<AuthInfo>(<AuthInfo>this.getAuthInfo());
  }

  // login(loginBody: LoginRequest): Observable<AuthInfo> {
  //   return this.httpClient
  //     .post<AuthTokenResponse>(constants.apiUrl.auth.login, loginBody, {
  //       context: addLoader('loginLoader'),
  //     })
  //     .pipe(
  //       map((response: AuthTokenResponse) => {
  //         const authInfo = this._storeAuthInfoInLocalStorage(response);
  //         const assetStorageService = this.injector.get(AssetStorageService);
  //         assetStorageService.populateAssetStorageData();
  //         return authInfo;
  //       }),
  //       catchError((error: any) => {
  //         return throwError(() => error);
  //       })
  //     );
  // }

  signupRequest(signupRequest: SignupRequest): Observable<Response> {
    return this.httpClient.post<Response>(constants.apiUrl.auth.signup, signupRequest, {
      context: addLoader('signupLoader'),
    });
  }

  isAccessTokenExpired(): boolean {
    const authInfo = this.getAuthInfo();
    if (authInfo) {
      return this.jwtHelper.isTokenExpired(authInfo.token);
    }
    return true;
  }

  isAuthenticated(): boolean {
    const authInfo = this.getAuthInfo();
    if (authInfo && authInfo.token) {
      return this.jwtHelper.isTokenExpired(authInfo.token);
    }
    return false;
  }

  getToken(): string | undefined | null {
    if (this.isAuthenticated()) {
      return this.getAuthInfo()?.token;
    }
    return null;
  }

  getAuthInfo(): AuthInfo | null {
    const authInfoStr = localStorage.getItem(constants.localStorageSessionKey);
    if (authInfoStr) {
      const authInfo: AuthInfo = JSON.parse(authInfoStr);
      return authInfo;
    }
    return null;
  }

  getAuthInfo$(): Observable<AuthInfo> {
    return this.authInfoSubject.asObservable();
  }

  getLandingPage(): string {
    return '/surveys';
  }

  updateLoggedInUserInfo(user: User): void {
    const authInfo = this.getAuthInfo();

    if (authInfo) {
      authInfo.user.firstName = user.firstName;
      authInfo.user.lastName = user.lastName;
      this._updateAuthInfoInLocationStorage(authInfo);
    }
  }

  private _getLoggedInUser(): LoggedInUser | null {
    const authInfo = this.getAuthInfo();
    return authInfo ? authInfo.user : null;
  }

  private _storeAuthInfoInLocalStorage(response: any): AuthInfo {
    const authInfo: AuthInfo = {
      user: this._decodeTokenAndMapLoggedInUser(response.accessToken),
      token: response.accessToken,
    };
    this._updateAuthInfoInLocationStorage(authInfo);
    return authInfo;
  }

  private _updateAuthInfoInLocationStorage(authInfo: AuthInfo): void {
    localStorage.setItem(constants.localStorageSessionKey, JSON.stringify(authInfo));
    this.authInfoSubject.next(authInfo);
  }

  private _removeAuthInfoFromLocalStorage(): boolean {
    if (localStorage.getItem(constants.localStorageSessionKey)) {
      localStorage.removeItem(constants.localStorageSessionKey);
      return true;
    }
    return false;
  }

  private _decodeTokenAndMapLoggedInUser(token: string): LoggedInUser {
    const decodedToken = this.jwtHelper.decodeToken(token);
    return {
      ...decodedToken,
    };
  }

  getUserId(): string | undefined {
    const user = this._getLoggedInUser();
    return user?.id;
  }
}
