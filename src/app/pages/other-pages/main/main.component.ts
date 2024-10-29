import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormControlComponent } from '@shared/components';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'nrc-main',
  standalone: true,
  imports: [BsDatepickerModule, ReactiveFormsModule, FormControlComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent {
  currentYear!: number;

  ngOnInit(): void {
    this.currentYear = new Date().getFullYear();
  }
}
