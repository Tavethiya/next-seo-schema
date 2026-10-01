import type { Thing, WithContext } from 'schema-dts';
import { assertAbsoluteUrls } from './url';
import { compact, serializeJsonLd } from './serialize';

export interface JsonLdProps {
  /** One or more schema.org objects. Each renders as its own script tag. */
  data: WithContext<Thing> | WithContext<Thing>[];
  /** Optional id for the script tag. Only applied when a single object is passed. */
  id?: string;
  /** Validate that every URL-like field is absolute. Defaults to true outside production. */
  validate?: boolean;
}

/**
 * Renders schema.org JSON-LD as an inline script tag of type application/ld+json.
 * Works in Next.js App Router server and client components with no extra setup.
 */
export function JsonLd({ data, id, validate }: JsonLdProps) {
  const shouldValidate = validate ?? process.env.NODE_ENV !== 'production';
  const items = Array.isArray(data) ? data : [data];
  return (
    <>
      {items.map((item, index) => {
        const cleaned = compact(item);
        if (shouldValidate) assertAbsoluteUrls(cleaned);
        return (
          <script
            key={id ? `${id}-${index}` : index}
            id={id && items.length === 1 ? id : undefined}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: serializeJsonLd(cleaned) }}
          />
        );
      })}
    </>
  );
}
