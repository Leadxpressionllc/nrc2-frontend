import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DialogBaseDirective } from './dialogbase.directive';

@Component({
  selector: 'so-popup',
  imports: [CommonModule],
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss'],
})
export class PopupComponent extends DialogBaseDirective {
  // Assign Unique Id to each popup
  static id = 'PopupComponent';

  constructor() {
    super();
  }

  onCloseEvent(e: any): void {
    this.onClose(e);
  }
}
