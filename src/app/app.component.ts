import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { EmitterService, TitleService } from '@core/services';
import { TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs';
import { constants } from './app.constant';

@Component({
  selector: 'nrc-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  showLoader: boolean = false;

  constructor(
    private titleService: TitleService,
    private translateService: TranslateService,
    private activatedRoute: ActivatedRoute,
    private emitterService: EmitterService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.router.events.pipe(filter((event) => event instanceof NavigationStart || event instanceof NavigationEnd)).subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.showLoader = true;
      } else if (event instanceof NavigationEnd) {
        this.titleService.setTitle(this.activatedRoute.snapshot);
        this.showLoader = false;
      }
    });

    this.translateService.setDefaultLang('en');
    this.translateService.use('en');

    this.emitterService.get(constants.events.hidePageLoader).subscribe(() => {
      this.showLoader = false;
    });

    this.emitterService.get(constants.events.logout).subscribe(() => {
      window.location.reload();
    });
  }
}
