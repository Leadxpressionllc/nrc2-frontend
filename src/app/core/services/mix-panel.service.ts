import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import mixpanel from 'mixpanel-browser';

@Injectable({
  providedIn: 'root',
})
export class MixPanelService {
  constructor() {
    mixpanel.init(environment.mixPanelToken, {
      track_pageview: true,
      persistence: 'localStorage',
    });
  }

  // Track an event
  track(event: string, properties?: any): void {
    mixpanel.track(event, properties);
  }

  register(properties?: any): void {
    mixpanel.register(properties);
  }

  // Identify a user
  identify(id: string): void {
    mixpanel.identify(id);
  }

  // Set user properties
  peopleSet(properties: any): void {
    mixpanel.people.set(properties);
  }
}
