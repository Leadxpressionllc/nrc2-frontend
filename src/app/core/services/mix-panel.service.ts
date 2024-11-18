import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import mixpanel from 'mixpanel-browser';

@Injectable({
  providedIn: 'root',
})
export class MixPanelService {
  constructor() {
    if (environment.production && environment.envName === 'PROD') {
      mixpanel.init(environment.mixPanelToken, {
        track_pageview: true,
        persistence: 'localStorage',
      });
    }
  }

  // Track an event
  track(event: string, properties?: any): void {
    if (environment.production && environment.envName === 'PROD') {
      mixpanel.track(event, properties);
    }
  }

  register(properties?: any): void {
    if (environment.production && environment.envName === 'PROD') {
      mixpanel.register(properties);
    }
  }

  // Identify a user
  identify(id: string): void {
    if (environment.production && environment.envName === 'PROD') {
      mixpanel.identify(id);
    }
  }

  // Set user properties
  peopleSet(properties: any): void {
    if (environment.production && environment.envName === 'PROD') {
      mixpanel.people.set(properties);
    }
  }
}
