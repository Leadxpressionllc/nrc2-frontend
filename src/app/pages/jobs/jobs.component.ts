import { Component, Input, NgZone, OnInit, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Job, JobResponse, User } from '@core/models';
import { AuthService, JobService } from '@core/services';
import { AppService } from '@core/utility-services';
import { FooterComponent, HeaderComponent } from '@shared/components';
import { LoaderDirective, TimeAgoDirective } from '@shared/directives';

@Component({
  selector: 'nrc-jobs',
  standalone: true,
  imports: [FormsModule, LoaderDirective, TimeAgoDirective, HeaderComponent, FooterComponent],
  templateUrl: './jobs.component.html',
  styleUrl: './jobs.component.scss',
})
export class JobsComponent implements OnInit {
  @Input('keyword') query!: string;

  start = 0;
  sortBy = 'r';
  location!: string;

  jobResponse!: JobResponse;
  jobs: Job[] = [];

  user!: User;
  googleAdsLoaded: boolean = false;

  constructor(
    private jobService: JobService,
    private authService: AuthService,
    private ngZone: NgZone,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.user = <User>this.authService.getAuthInfo()?.user;

    if (!AppService.isUndefinedOrNull(this.user.zipCode)) {
      this.location = this.user.zipCode;
      this._loadJobs();
    }

    this.loadGoogleAdsScript();
  }

  findNewJobs(): void {
    this.start = 0;
    this.jobs = [];
    this._loadJobs();
  }

  loadMoreJobs(): void {
    this.start = this.jobResponse.start + this.jobResponse.count;
    this._loadJobs();
  }

  private _loadJobs(): void {
    this.jobService.getJobs(this.start, this.sortBy, this.query, this.location).subscribe((response: JobResponse) => {
      this.jobResponse = response;
      this.jobs = this.jobs.concat(response.jobs);
    });
  }

  loadGoogleAdsScript(): void {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
    script.async = true;
    this.renderer.appendChild(document.head, script);

    script.onload = () => {
      this.ngZone.run(() => {
        this.googleAdsLoaded = true;
      });
    };
  }
}
