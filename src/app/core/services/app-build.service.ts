import { ApplicationRef, Injectable } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { BehaviorSubject, Observable, concat, filter, first, interval, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppBuildService {
  private newVersionAvailableSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private appRef: ApplicationRef,
    private swUpdate: SwUpdate
  ) {}

  getNewVersionAvailable$(): Observable<boolean> {
    return this.newVersionAvailableSubject.asObservable();
  }

  loadNewAvailableVersion(): void {
    if (!this.swUpdate.isEnabled) {
      return;
    }

    this.swUpdate.versionUpdates.pipe(filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY')).subscribe((evt) => {
      console.log('Event', evt);
      this.newVersionAvailableSubject.next(true);
    });
  }

  async checkForNewUpdate() {
    if (!this.swUpdate.isEnabled) {
      return;
    }

    // Allow the app to stabilize first, before starting polling for updates with `interval()`.
    const appIsStable$ = this.appRef.isStable.pipe(first((isStable) => isStable === true));
    const intervalInMinutes$ = interval(10 * 60 * 1000);
    const startIntervalOnceAppIsStable$ = concat(appIsStable$, intervalInMinutes$);

    startIntervalOnceAppIsStable$.subscribe(async () => {
      try {
        const updateFound = await this.swUpdate.checkForUpdate();
        console.log(updateFound ? 'A new version is available.' : 'Already on the latest version.');
      } catch (err) {
        console.error('Failed to check for updates:', err);
      }
    });
  }
}
