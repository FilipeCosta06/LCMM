const HOSTNAME = 'http://localhost';
const PORT = '3001';
const HOST = HOSTNAME + ":" + PORT;
/**
 * @description URL des routes du server
 */
const CONFIG_BACKEND = {
    URL_REGISTER: `${HOST}/api/users/register`,
    URL_LOGIN: `${HOST}/api/users/login`,
    URL_SUBMIT_PLUGIN: `${HOST}/api/users/me/submissionForm`,
    URL_GET_PLUGINS: `${HOST}/api/plugins`
};

/**
 * @description URL des pages de l'application front
 */
const CONFIG_FRONTEND = {
    URL_DEFAULT: '/',               // redirects to `/home`
    URL_HOME: '/home',
    URL_LOGIN: '/login',
    URL_REGISTER: '/register',
    URL_LOGOUT: '/logout',
    URL_USER_PROFILE: '/profile',
    URL_ADD_PLUGIN: '/addPlugin',
    URL_CART: '/cart',
    URL_404: '*'
};

/**
 * @description Actions possibles avec le contexte global de l'application
 */
const CONFIG_DISPATCH_ACTIONS = {
    LOGIN: 'login',
    LOGOUT: 'logout',
    DISPLAY_LOADING: 'display-loading',
    HIDE_LOADING: 'hide-loading'
};

const REGEX_EXPRESSIONS = {
    MATCH_EMAIL: '^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$',
    MATCH_NON_EMPTY_AND_NON_SPACE_ONLY: '^(?!\s*$).+'
};

const CONFIG_COOKIE = {
    DEFAULT_EXPIRATION_TIME_MS: 5 * 60 * 1000,  // Les cookies expirent après 5 minutes, par défaut
    LONG_EXPIRATION_TIME_MS: 30 * 24 * 60 * 60 * 1000,  // 30 jours
    USER_AUTH_TOKEN_KEY: 'token',               // idéalement, la même que pour le back
};

const ERRORS = {
    MISSING_MANDATORY_PARAMETER: "Missing or invalid mandatory function parameter",
    INVALID_PARAMETER_VALUE: "Invalid function parameter"
};

export {
    CONFIG_BACKEND,
    CONFIG_FRONTEND,
    CONFIG_DISPATCH_ACTIONS,
    REGEX_EXPRESSIONS,
    CONFIG_COOKIE,
    ERRORS
};
