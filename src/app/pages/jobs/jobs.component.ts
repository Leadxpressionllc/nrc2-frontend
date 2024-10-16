import { Component } from '@angular/core';
import { FooterComponent, HeaderComponent } from '@shared/components';

@Component({
  selector: 'nrc-jobs',
  standalone: true,
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './jobs.component.html',
  styleUrl: './jobs.component.scss',
})
export class JobsComponent {}
