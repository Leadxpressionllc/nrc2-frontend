import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogBaseDirective } from '@shared/components';

@Component({
  selector: 'nrc-password-confirmation-popup',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './password-confirmation-popup.component.html',
  styleUrls: ['./password-confirmation-popup.component.scss'],
})
export class PasswordConfirmationPopupComponent extends DialogBaseDirective {
  static id = 'PasswordConfirmationPopupComponent';

  password = '';

  constructor() {
    super();
  }

  onContinue(): void {
    this.onClose(this.password);
  }
}
