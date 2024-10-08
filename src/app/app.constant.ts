export const constants = {
  localStorageSessionKey: 'nrc-auth',

  apiUrl: {
    auth: {
      signup: '/signup',
    },

    users: {
      base: '/users',
    },

    surveys: {
      base: '/surveys',
    },

    offers: {
      base: '/offers',
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
