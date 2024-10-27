import { Directive, inject, OnDestroy } from '@angular/core';
import { Offer, User } from '@core/models';
import { AuthService, OfferService, UserService } from '@core/services';
import { AppService } from '@core/utility-services';
import { Subject } from 'rxjs';

@Directive()
export abstract class AbstractOfferHelper implements OnDestroy {
  userService: UserService;
  offerService: OfferService;
  authService: AuthService;

  user!: User;

  private userLoadedSubject!: Subject<User>;

  constructor() {
    this.userService = inject(UserService);
    this.offerService = inject(OfferService);
    this.authService = inject(AuthService);

    this.user = <User>this.authService.getAuthInfo()?.user;
  }

  ngOnDestroy(): void {
    if (this.userLoadedSubject) {
      this.userLoadedSubject.unsubscribe();
    }
  }

  loadUser(): Subject<User> {
    if (this.userLoadedSubject) {
      this.userLoadedSubject.unsubscribe();
    }

    this.userLoadedSubject = new Subject<User>();

    this.userService.getUser().subscribe((user: User) => {
      this.user = user;
      this.userLoadedSubject.next(this.user);
    });

    return this.userLoadedSubject;
  }

  onOfferClick(offer: Offer): void {
    this._redirectToOffer(offer);
  }

  getOfferLink(offer: Offer, userId: string, offerCallBackId: string): string {
    const urlSeparator = offer.offerUrl.includes('?') ? '&' : '?';
    const offerUrl = `${offer.offerUrl}${urlSeparator}`;

    const urlWithPlaceholders = this._replacePlaceholdersInOfferUrl(offerUrl, offerCallBackId);

    const params = new URLSearchParams({
      sub1: offer.id,
      sub2: userId,
      sub3: offerCallBackId,
    });

    return `${urlWithPlaceholders}${params.toString()}`;
  }

  private _redirectToOffer(offer: Offer): void {
    const offerLink = AppService.getWebsiteBaseUrl() + '/offer-redirect/' + offer.id;
    window.open(offerLink, '_blank');
  }

  private _replacePlaceholdersInOfferUrl(offerUrl: string, offerCallBackId: string): string {
    const loggedInUser = this.authService.getAuthInfo()?.user as User;

    // Use the this.user if loaded, otherwise use the user info from AuthInfo
    const user = this.user ?? loggedInUser;

    // Define a mapping of placeholders to their corresponding user values
    const placeholders: Record<string, string> = {
      '[FIRST_NAME]': user.firstName,
      '[LAST_NAME]': user.lastName ?? '',
      '[EMAIL]': user.email,
      '[GENDER]': user.gender ?? '',
      '[BIRTH_DATE]': user.dob ?? '',
      '[STREET_ADDRESS]': user.address ?? '',
      '[CITY]': user.city ?? '',
      '[STATE]': user.state ?? '',
      '[COUNTRY]': user.country ?? '',
      '[ZIP_CODE]': user.zipCode ?? '',
      '[TRANSACTION_ID]': offerCallBackId,
    };

    // Use reduce to iterate over the placeholders and replace them in the URL
    return Object.entries(placeholders).reduce(
      (url, [placeholder, value]) =>
        // Only replace if the placeholder exists in the URL
        url.includes(placeholder) ? url.replace(placeholder, value) : url,
      offerUrl // Start with the original offerUrl
    );
  }
}
