import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AppService } from '@core/utility-services';
import { DialogBaseDirective } from '../popup/dialogbase.directive';

@Component({
  selector: 'nrc-confirmation',
  imports: [CommonModule],
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss'],
})
export class ConfirmationComponent extends DialogBaseDirective implements OnInit {
  static id = 'ConfirmationComponent';

  ngOnInit(): void {
    if (AppService.isUndefinedOrNull(this.data.yesButtonText)) {
      this.data.yesButtonText = 'Delete';
    }

    if (AppService.isUndefinedOrNull(this.data.cancelButtontext)) {
      this.data.cancelButtontext = 'Cancel';
    }
  }

  onContinue(): void {
    this.onClose(true);
  }
}
