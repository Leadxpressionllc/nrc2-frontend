import { Component } from '@angular/core';
import { FooterComponent } from '@shared/components';

@Component({
  selector: 'nrc-offers',
  standalone: true,
  imports: [FooterComponent],
  templateUrl: './offers.component.html',
  styleUrl: './offers.component.scss',
})
export class OffersComponent {}
