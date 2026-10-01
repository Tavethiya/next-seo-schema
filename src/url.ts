const ABSOLUTE_URL = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;

export class SchemaUrlError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SchemaUrlError';
  }
}

/** Returns true when the value is an absolute http(s) URL. */
export function isAbsoluteUrl(value: string): boolean {
  return ABSOLUTE_URL.test(value);
}

/**
 * Resolves a path or URL against a base URL and guarantees the result is absolute.
 * Google ignores JSON-LD with relative URLs, so this throws instead of silently
 * emitting an invalid value.
 */
export function absoluteUrl(value: string, baseUrl?: string): string {
  if (isAbsoluteUrl(value)) return value;
  if (!baseUrl) {
    throw new SchemaUrlError(
      `"${value}" is not an absolute URL. Pass an absolute URL or set baseUrl.`
    );
  }
  if (!isAbsoluteUrl(baseUrl)) {
    throw new SchemaUrlError(`baseUrl "${baseUrl}" must be an absolute http(s) URL.`);
  }
  return new URL(value, baseUrl).toString();
}

/** Keys whose string values must be absolute URLs. */
const URL_KEYS = new Set(['url', 'item', 'image', 'logo', 'sameAs', 'contentUrl', 'thumbnailUrl']);

/** Walks an object and asserts every value under a URL-like key is absolute. */
export function assertAbsoluteUrls(input: unknown, path = ''): void {
  if (Array.isArray(input)) {
    input.forEach((v, i) => assertAbsoluteUrls(v, `${path}[${i}]`));
    return;
  }
  if (input && typeof input === 'object') {
    for (const [key, value] of Object.entries(input)) {
      const nextPath = path ? `${path}.${key}` : key;
      if (URL_KEYS.has(key)) {
        const values = Array.isArray(value) ? value : [value];
        for (const v of values) {
          if (typeof v === 'string' && !isAbsoluteUrl(v)) {
            throw new SchemaUrlError(`${nextPath} must be an absolute URL, got "${v}".`);
          }
        }
      }
      assertAbsoluteUrls(value, nextPath);
    }
  }
}
