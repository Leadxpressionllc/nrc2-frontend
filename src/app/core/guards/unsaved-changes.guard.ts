import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivateFn } from '@angular/router';
import { constants } from '@app/constant';
import { EmitterService, PopupService } from '@core/services';
import { ConfirmationComponent } from '@shared/components';
import { Observable, map } from 'rxjs';

export interface ComponentCanDeactivate {
  canDeactivate: () => boolean | Observable<boolean>;
}

/**
 * This guard checks if there is unsaved changes in the form then show warning popup to user before
 * navigating away from the page.
 */
export const unsavedChangesGuard = (): CanDeactivateFn<ComponentCanDeactivate> => {
  return (component: ComponentCanDeactivate, route: ActivatedRouteSnapshot): boolean | Observable<boolean> => {
    if (component.canDeactivate()) {
      return true;
    }

    // NOTE: this warning message will only be shown when navigating elsewhere within your angular app;
    // when navigating away from your angular app, the browser will show a generic warning message
    // see http://stackoverflow.com/a/42207299/7307355

    const popupService = inject(PopupService);
    const emitterService = inject(EmitterService);

    emitterService.emit(constants.events.hidePageLoader);

    const modalRef = popupService.openWithComponent(ConfirmationComponent, {
      heading: 'Unsaved Changes',
      message: 'You have unsaved changes. Are you sure you want to leave the page? <br/> Unsaved changes will be lost.',
      icon: 'warning',
      yesButtonText: 'Leave this page',
      cancelButtontext: 'Stay on this page',
    });

    return modalRef.eventEmitter.pipe(
      map((result: boolean) => {
        return result;
      })
    );
  };
};
