import { sameOriginFetch } from "./sameOriginFetch";

export function getTags() {
  return sameOriginFetch("/api/tags");
}
