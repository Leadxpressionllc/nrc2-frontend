import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AppBuildService } from '@core/services';
import { AlertModule } from 'ngx-bootstrap/alert';
import { Observable } from 'rxjs';

@Component({
  selector: 'nrc-new-build-notification',
  imports: [CommonModule, AlertModule],
  templateUrl: './new-build-notification.component.html',
  styleUrls: ['./new-build-notification.component.scss'],
})
export class NewBuildNotificationComponent {
  isNewAppVersionAvailable$!: Observable<boolean>;

  constructor(private appBuildService: AppBuildService) {
    this.isNewAppVersionAvailable$ = this.appBuildService.getNewVersionAvailable$();
    this.appBuildService.loadNewAvailableVersion();
    this.appBuildService.checkForNewUpdate();
  }

  reloadApp(): void {
    window.location.reload();
  }
}
