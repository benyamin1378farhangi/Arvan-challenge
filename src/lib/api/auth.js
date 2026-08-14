import { sameOriginFetch } from "./sameOriginFetch";

export function login({ username, password }) {
  return sameOriginFetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export function logout() {
  return sameOriginFetch("/api/auth/logout", { method: "POST" });
}

export function getCurrentUser() {
  return sameOriginFetch("/api/auth/me");
}

export function registerUser({ username, email, password }) {
  return sameOriginFetch("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ username, email, password }),
  });
}
