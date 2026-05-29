const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

export function isMutatingMethod(method: string): boolean {
  return !SAFE_METHODS.has(method.toUpperCase());
}

export function isSameOriginRequest(
  requestUrl: string,
  origin: string | null,
  referer: string | null
): boolean {
  const expectedOrigin = new URL(requestUrl).origin;
  if (origin) return origin === expectedOrigin;
  if (referer) return new URL(referer).origin === expectedOrigin;

  // Some non-browser clients omit both headers; route-level auth still applies.
  return true;
}
