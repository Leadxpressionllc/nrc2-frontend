import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRouteSnapshot } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AppService } from '../utility-services/app.service';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * This service is responsible for setting the current page title by reading the title information from ActivatedRoutes
 */
@Injectable({ providedIn: 'root' })
export class TitleService {
  currentTitleSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(private title: Title) {}

  setTitle(snapshot: ActivatedRouteSnapshot): void {
    let lastChild = snapshot;
    let parentTitle = '';
    while (lastChild.children.length) {
      parentTitle = lastChild.data['title'];
      lastChild = lastChild.children[0];
    }
    const { title } = lastChild.data;

    if (title) {
      if (!AppService.isUndefinedOrNull(parentTitle)) {
        this.title.setTitle(`${parentTitle} | ${title}`);
      } else {
        this.title.setTitle(`${environment.appName} | ${title}`);
      }
      this._setCurrentPageTitle(parentTitle, title);
    } else {
      this.title.setTitle(environment.appName);
    }
  }

  getCurrentPageTitle$(): Observable<string> {
    return this.currentTitleSubject.asObservable();
  }

  private _setCurrentPageTitle(parentTitle: string, title: string): void {
    this.currentTitleSubject.next(title ? title : parentTitle);
  }
}
