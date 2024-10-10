import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { constants } from '@app/constant';
import { JwtHelperService } from '@auth0/angular-jwt';
import { addLoader } from '@core/loader-context';
import { User } from '@core/models';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { AuthInfo, UserSourceInfo, LoginRequest, SignupRequest } from '../models/auth.models';
import { EmitterService } from './emitter.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private authInfoSubject: BehaviorSubject<AuthInfo>;

  private jwtHelper: JwtHelperService = new JwtHelperService();

  constructor(
    private httpClient: HttpClient,
    private emitterService: EmitterService
  ) {
    this.authInfoSubject = new BehaviorSubject<AuthInfo>(<AuthInfo>this.getAuthInfo());
  }

  login(loginBody: LoginRequest): Observable<AuthInfo> {
    return this.httpClient
      .post<AuthInfo>(constants.apiUrl.auth.login, loginBody, {
        context: addLoader('loginLoader'),
      })
      .pipe(
        map((authInfo: AuthInfo) => {
          this._updateAuthInfoInLocalStorage(authInfo);
          return authInfo;
        })
      );
  }

  signup(signupRequest: SignupRequest): Observable<AuthInfo> {
    return this.httpClient
      .post<AuthInfo>(constants.apiUrl.auth.signup, signupRequest, {
        context: addLoader('signupLoader'),
      })
      .pipe(
        map((authInfo: AuthInfo) => {
          this._updateAuthInfoInLocalStorage(authInfo);
          return authInfo;
        })
      );
  }

  autoLogin(userId: string): Observable<AuthInfo> {
    return this.httpClient
      .post<AuthInfo>(constants.apiUrl.auth.autoLogin, userId, {
        context: addLoader('autoLoginLoader'),
      })
      .pipe(
        map((authInfo: AuthInfo) => {
          this._updateAuthInfoInLocalStorage(authInfo);
          return authInfo;
        })
      );
  }

  logout(redirectToLoginPage: boolean): void {
    this._removeAuthInfoFromLocalStorage();
    if (redirectToLoginPage) {
      this.emitterService.emit(constants.events.logout);
    }
  }

  unsubscribeUserByEmail(email: string): Observable<any> {
    return this.httpClient.post(constants.apiUrl.auth.unsubscribeByEmail, email, {
      context: addLoader('unsubscribeUserLoader'),
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

  getUserId(): string | undefined {
    const user = this._getLoggedInUser();
    return user?.id;
  }

  getLoggedInUserSourceInfo(): UserSourceInfo | undefined {
    const authInfo = this.getAuthInfo();
    return authInfo?.sourceInfo;
  }

  updateLoggedInUserInfo(user: User): void {
    const authInfo = this.getAuthInfo();

    if (authInfo) {
      authInfo.user.firstName = user.firstName;
      authInfo.user.lastName = user.lastName;
      this._updateAuthInfoInLocalStorage(authInfo);
    }
  }

  updateLoggedInUserInfoInLocalStorage(user: User): void {
    const authInfo = this.getAuthInfo();
    if (authInfo) {
      authInfo.user = user;
      localStorage.setItem(constants.localStorageSessionKey, JSON.stringify(authInfo));
      this._updateAuthInfoInLocalStorage(authInfo);
      this.authInfoSubject.next(authInfo);
    }
  }

  private _getLoggedInUser(): User | null {
    const authInfo = this.getAuthInfo();
    return authInfo ? authInfo.user : null;
  }

  private _updateAuthInfoInLocalStorage(authInfo: AuthInfo): void {
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
}
