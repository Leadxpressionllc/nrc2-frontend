import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FooterComponent } from '@shared/components';

@Component({
  selector: 'nrc-surveys',
  standalone: true,
  imports: [CommonModule, FooterComponent],
  templateUrl: './surveys.component.html',
  styleUrl: './surveys.component.scss',
})
export class SurveysComponent {
  steps = [
    { name: '1', completed: false },
    { name: '2', completed: false },
    { name: '4', completed: false },
    { name: '5', completed: false },
    { name: '6', completed: false },
    { name: '7', completed: false },
    { name: '8', completed: false },
  ];
  currentStep = 1;

  onNextStep() {
    if (this.currentStep < this.steps.length) {
      this.steps[this.currentStep - 1].completed = true;
      this.currentStep++;
    }
  }
}
