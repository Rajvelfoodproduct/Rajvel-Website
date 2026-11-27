const DEFAULT_SITE_URL = "https://rajvelfoodproducts.netlify.app";

/**
 * Returns the canonical production origin without a trailing slash.
 * Configure SITE_URL in Netlify and GitHub Actions variables to override.
 */
export function getSiteUrl(): string {
  const raw =
    process.env.SITE_URL ||
    process.env.URL ||
    process.env.DEPLOY_PRIME_URL ||
    DEFAULT_SITE_URL;

  try {
    const parsed = new URL(raw);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      return DEFAULT_SITE_URL;
    }
    return parsed.origin;
  } catch {
    return DEFAULT_SITE_URL;
  }
}

export const SITE_URL = getSiteUrl();

/**
 * Serializes JSON-LD safely for embedding inside a <script> tag,
 * escaping HTML-significant characters to prevent script breakout / XSS.
 */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}
