import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { constants } from '@app/constant';
import { UserService } from '@core/services';
import { AppService } from '@core/utility-services';

@Component({
  selector: 'nrc-redirect',
  standalone: true,
  imports: [],
  templateUrl: './redirect.component.html',
  styleUrl: './redirect.component.scss',
})
export class RedirectComponent implements OnInit {
  @Input() pageName!: string;

  constructor(
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    if (this.pageName) {
      if (this.pageName === 'welcomeSurveys') {
        this.userService.trackWelcomeEmailLink().subscribe(() => {
          this._redirectToPage(this.pageName);
        });
      } else {
        this._redirectToPage(this.pageName);
      }
    } else {
      this.router.navigate([constants.landingPageAfterLogin]);
    }
  }

  private _redirectToPage(pageName: string): void {
    pageName = AppService.getRouteByPageName(pageName);
    this.router.navigate([pageName]);
  }
}
