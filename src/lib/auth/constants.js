export const SESSION_COOKIE_NAME = "session_token";

export const SESSION_MAX_AGE_SECONDS = 60 * 60;

export const DEMO_LOGIN_USERNAME = "arvan";
export const DEMO_LOGIN_PASSWORD = "arvanpass";

export const DUMMYJSON_ACCOUNT_FOR_DEMO_LOGIN = {
  username: "emilys",
  password: "emilyspass",
};

export function resolveDummyJsonCredentials(username, password) {
  if (username === DEMO_LOGIN_USERNAME && password === DEMO_LOGIN_PASSWORD) {
    return DUMMYJSON_ACCOUNT_FOR_DEMO_LOGIN;
  }
  return { username, password };
}
