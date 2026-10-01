/**
 * Serializes JSON-LD safely for inline script tags.
 * Escapes "<" so a value containing a closing script tag cannot break out.
 */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

/** Strips undefined and null values recursively so emitted JSON-LD stays clean. */
export function compact<T>(input: T): T {
  if (Array.isArray(input)) {
    return input
      .filter((v) => v !== undefined && v !== null)
      .map((v) => compact(v)) as T;
  }
  if (input && typeof input === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(input as Record<string, unknown>)) {
      if (v === undefined || v === null) continue;
      out[k] = compact(v);
    }
    return out as T;
  }
  return input;
}
