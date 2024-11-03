import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomainInfo } from '@core/models';
import { SignupFormComponent } from '@pages/home/signup-form/signup-form.component';

@Component({
  selector: 'nrc-main',
  standalone: true,
  imports: [SignupFormComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent implements OnInit {
  domainInfo!: DomainInfo;

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((data) => {
      if (data['domainInfo']) {
        this.domainInfo = data['domainInfo'];
      }
    });
  }
}
