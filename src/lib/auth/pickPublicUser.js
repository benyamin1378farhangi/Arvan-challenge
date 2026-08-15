import { DEMO_LOGIN_USERNAME, DUMMYJSON_ACCOUNT_FOR_DEMO_LOGIN } from "./constants";

export function pickPublicUser(user) {
  const isDemoAccount = user.username === DUMMYJSON_ACCOUNT_FOR_DEMO_LOGIN.username;

  return {
    id: user.id,
    username: isDemoAccount ? DEMO_LOGIN_USERNAME : user.username,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    image: user.image,
  };
}
