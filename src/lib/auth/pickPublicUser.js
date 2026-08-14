// DummyJSON's user objects (from both /auth/login and /auth/me) include a
// lot more than a blog dashboard needs — including the account's plaintext
// password, echoed back in the response. Shared by both routes so there's
// exactly one place that decides what's safe to send to the client.
export function pickPublicUser(user) {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    image: user.image,
  };
}
