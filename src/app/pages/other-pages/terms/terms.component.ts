import { Component } from '@angular/core';
import { OtherFooterComponent } from '../other-footer/other-footer.component';
import { OtherHeaderComponent } from '../other-header/other-header.component';

@Component({
  selector: 'nrc-terms',
  standalone: true,
  imports: [OtherFooterComponent, OtherHeaderComponent],
  templateUrl: './terms.component.html',
  styleUrl: './terms.component.scss',
})
export class TermsComponent {
  currentYear!: number;

  ngOnInit(): void {
    this.currentYear = new Date().getFullYear();
  }
}
