import { Component } from '@angular/core';
import { DialogBaseDirective } from '@shared/components';

@Component({
  selector: 'nrc-data-policies-popup',
  imports: [],
  templateUrl: './data-policies-popup.component.html',
  styleUrl: './data-policies-popup.component.scss',
})
export class DataPoliciesPopupComponent extends DialogBaseDirective {
  static id = 'DataPoliciesPopupComponent';

  constructor() {
    super();
  }
}
