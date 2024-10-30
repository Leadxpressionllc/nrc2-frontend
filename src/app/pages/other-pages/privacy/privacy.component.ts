import { Component } from '@angular/core';
import { OtherHeaderComponent } from '../other-header/other-header.component';
import { OtherFooterComponent } from '../other-footer/other-footer.component';

@Component({
  selector: 'nrc-privacy',
  standalone: true,
  imports: [OtherHeaderComponent, OtherFooterComponent],
  templateUrl: './privacy.component.html',
  styleUrl: './privacy.component.scss',
})
export class PrivacyComponent {
  currentYear!: number;

  ngOnInit(): void {
    this.currentYear = new Date().getFullYear();
  }
}
