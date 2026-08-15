export async function sameOriginFetch(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error(payload?.message || "Request failed");
    error.status = response.status;
    throw error;
  }

  return payload;
}
