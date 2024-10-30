import { Component, Input } from '@angular/core';

@Component({
  selector: 'nrc-other-footer',
  standalone: true,
  imports: [],
  templateUrl: './other-footer.component.html',
  styleUrl: './other-footer.component.scss',
})
export class OtherFooterComponent {
  @Input() brandDomain: string | undefined;
  currentYear!: number;

  ngOnInit(): void {
    this.currentYear = new Date().getFullYear();
  }
}
