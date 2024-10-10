export const constants = {
  localStorageSessionKey: 'nrc-auth',

  apiUrl: {
    auth: {
      login: '/login',
      signup: '/signup',
      autoLogin: '/auto-login',
      unsubscribeByEmail: 'unsubscribe-by-email',
    },

    users: {
      base: '/users',
      trackWelcomeEmail: 'users/track-welcome-email',
    },

    surveys: {
      base: '/surveys',
      liveSurvey: 'surveys/live',
      liveSurveyId: 'surveys/live/id',
    },

    offers: {
      base: '/offers',
      bySurveyId: 'offers/by-survey',
      specialOffers: 'offers/special-offers',
      logUserReturnedFromLinkoutOffer: 'offers/log-user-returned',
    },

    jobs: {
      base: '/jobs',
    },

    signupFlow: {
      base: '/flow',
    },
  },

  apiRequestHeaders: {
    default: {
      contentType: 'application/json',
    },
  },

  apiRequestHeaderKeys: {
    contentType: 'Content-Type',
    custom: {
      skipContentType: 'Skip-Content-Type',
    },
  },

  dateFormats: {
    mmddyyyy: 'MM-dd-yyyy',
    yyyyMMddHHmmss: 'yyyy-MM-dd HH:mm:ss',
    MMDDYYYY_hhmm: 'MM/DD/YYYY hh:mm',
    momentDateTime: 'MM/DD/YYYY HH:mm:ss',
    moment_yyyyMMddHHmmss: 'YYYY-MM-DD HH:mm:ss',
    yyyyMMdd: 'yyyy-MM-dd',
  },

  events: {
    loggedIn: 'loggedIn',
    logout: 'logout',
    hidePageLoader: 'hidePageLoader',
  },

  errors: {
    name: {
      unknown: 'UNKNOWN',
    },
  },
};
