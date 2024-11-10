import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SignupFormComponent } from './signup-form/signup-form.component';
import { FooterComponent, HeaderComponent } from '@shared/components';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { MixPanelService } from '@core/services';
import { ActivatedRoute } from '@angular/router';
import { AppService } from '@core/utility-services';
import { CountUpModule } from 'ngx-countup';

@Component({
  selector: 'nrc-home',
  standalone: true,
  imports: [CommonModule, AccordionModule, AngularSvgIconModule, CountUpModule, SignupFormComponent, FooterComponent, HeaderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  constructor(
    private route: ActivatedRoute,
    private mixPanelService: MixPanelService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (AppService.isUndefinedOrNull(params)) {
        this._sendQueryParamsToMixPanel(params);
      }
    });
  }

  private _sendQueryParamsToMixPanel(params: any): void {
    if (!AppService.isUndefinedOrNull(params['email'])) {
      const userObject = {
        name: params['firstName'],
        email: params['email'],
        zip_code: params['zipCode'],
      };

      this.mixPanelService.register(userObject);
      this.mixPanelService.peopleSet(userObject);
    }

    const sourceObject = {
      surveyId: params['surveyId'],
      source: params['sid'],
      sub_source_id_1: params['subid1'],
      sub_source_id_2: params['subid2'],
      sub_source_id_3: params['subid3'],
      sub_source_id_4: params['subid4'],
    };

    this.mixPanelService.track('landing_page_visit', sourceObject);
  }

  trackClickAndScrollToTop(eventName: string, eventValue: string) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.mixPanelService.track(eventName, { cta_name: eventValue });
  }
}
