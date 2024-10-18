export const constants = {
  localStorageSessionKey: 'nrc-auth',

  apiUrl: {
    auth: {
      login: '/login',
      signup: '/signup',
      autoLogin: '/auto-login',
      unsubscribeByEmail: '/unsubscribe-by-email',
    },

    users: {
      base: '/users',
      trackWelcomeEmail: '/users/track-welcome-email',
    },

    surveys: {
      base: '/surveys',
      liveSurvey: '/surveys/live',
      liveSurveyId: '/surveys/live/id',
    },

    offers: {
      base: '/offers',
      bySurveyId: '/offers/by-survey',
      specialOffers: '/offers/special-offers',
      logUserReturnedFromLinkoutOffer: '/offers/log-user-returned',
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

  defaultSignupFlow: {
    heading: "Find The Relief <br /> Specifically Designed <br class='show-mob' /> <br class='hide-mob'> To Meet Your Needs",
    paragraph:
      'We aim to be your go-to resource for exploring different assistance options. With our detailed financial aid blog and optional assistance survey, uncover new ways to tackle everyday challenges.',
    backgroundImageUrl: 'https://nationalresourceconnect.com/bnr-bg.ad3de42c5eb7d456.jpg',
    formFields: [
      { label: 'Full Name', name: 'fullName' },
      { label: 'Email', name: 'email' },
      { label: 'Zip Code', name: 'zipCode' },
      { label: 'Date of Birth', name: 'dob' },
      { label: 'Phone (Optional)', name: 'phone' },
    ],
  },

  dynamicQuestionRenderer: {
    questionHtmlElement: {
      INPUT: 'INPUT',
      DATE: 'DATE',
      BUTTON: 'BUTTON',
      SELECT: 'SELECT',
      CHECKBOX_GROUP: 'CHECKBOX_GROUP',
      RADIO_BUTTON_GROUP: 'RADIO_BUTTON_GROUP',
    },
  },

  userPlaceholders: [
    '[FIRST_NAME]',
    '[LAST_NAME]',
    '[EMAIL]',
    '[AGE]',
    '[BIRTH_DATE]',
    '[BIRTH_DAY]',
    '[BIRTH_MONTH]',
    '[BIRTH_YEAR]',
    '[PHONE_NUMBER]',
    '[PHONE_AREA_CODE]',
    '[PHONE_PREFIX]',
    '[PHONE_SUFFIX]',
    '[GENDER]',
    '[GENDER_FULL]',
    '[STREET_ADDRESS]',
    '[CITY]',
    '[STATE]',
    '[COUNTRY]',
    '[COUNTRY_CODE]',
    '[ZIP_CODE]',
  ],

  routesMapper: {
    surveys: 'surveys',
    welcomeSurveys: 'surveys',
  },

  surveyTypes: {
    triggerOffersOnSurveySubmit: 'TRIGGER_OFFERS_ON_SURVEY_SUBMIT',
    triggerOffersOnPageSubmit: 'TRIGGER_OFFERS_ON_PAGE_SUBMIT',
  },

  userOfferAction: {
    impression: 'IMPRESSION',
    yesClick: 'YES_CLICK',
    noClick: 'NO_CLICK',
    submit: 'SUBMIT',
  },
};
