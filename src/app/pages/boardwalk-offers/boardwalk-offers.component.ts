import { Component, Input, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '@core/models';
import { AuthService } from '@core/services';
import { FooterComponent, HeaderComponent } from '@shared/components';

@Component({
  selector: 'nrc-boardwalk-offers',
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './boardwalk-offers.component.html',
  styleUrl: './boardwalk-offers.component.scss',
})
export class BoardwalkOffersComponent implements OnInit {
  @Input('pid') pathId!: string; // path params

  constructor(
    private renderer: Renderer2,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    if (!this.pathId) {
      // Default BroadWalk PathId
      // this.pathId = 'b6f274d9-f244-49ed-8176-f29c52361436';
      this.pathId = 'e562f92d-4a25-40fa-8138-e0bcc1f41e44';
    }

    this.route.queryParams.subscribe((params) => {
      let zip = params['zip'];
      let email = params['email'];

      if (!zip || !email) {
        const loggedInUser = <User>this.authService.getAuthInfo()?.user;
        zip = loggedInUser.zipCode;
        email = loggedInUser.email;

        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { zip, email },
          queryParamsHandling: 'merge',
        });
      } else {
        this._loadBoardWalkScript();
      }
    });
  }

  private _loadBoardWalkScript(): void {
    const cfg = {
      pid: this.pathId,
      role: 'path',
      root: 'promenade',
    };

    this._loadExternalJavascript(`https://api.boardwalk.marketing/promenade/loader/?pid=${cfg.pid}&role=${cfg.role}`).onload = () => {
      console.log('boardwalk Script loaded.');
    };

    (<any>window)['boardwalk'] = cfg;
  }

  private _loadExternalJavascript(src: string): HTMLScriptElement {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = src;
    script.async = true;
    this.renderer.appendChild(document.body, script);
    return script;
  }
}
