# next-seo-schema

Typed [schema.org](https://schema.org) JSON-LD for Next.js App Router, with absolute-URL validation built in.

[![CI](https://github.com/Tavethiya/next-seo-schema/actions/workflows/ci.yml/badge.svg)](https://github.com/Tavethiya/next-seo-schema/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/next-seo-schema)](https://www.npmjs.com/package/next-seo-schema)
[![license](https://img.shields.io/npm/l/next-seo-schema)](./LICENSE)

Google silently ignores structured data that contains relative URLs. This package makes that mistake impossible: every builder resolves paths against a `baseUrl`, and the `<JsonLd>` component validates the final object before it renders.

## Install

```bash
npm install next-seo-schema
```

Requires React 18+. Works with Next.js 13, 14 and 15 App Router. No dependency on `next` itself, so it also works in Remix, Astro or plain React SSR.

## Quick start

```tsx
// app/blog/[slug]/page.tsx
import { JsonLd, article, breadcrumb } from 'next-seo-schema';

const baseUrl = 'https://example.com';

export default function Page({ post }) {
  return (
    <>
      <JsonLd
        data={[
          article({
            headline: post.title,
            url: `/blog/${post.slug}`,
            image: post.cover,
            datePublished: post.publishedAt,
            author: { name: post.author },
            publisher: { name: 'Example', logo: '/logo.png' },
            baseUrl,
          }),
          breadcrumb({
            items: [
              { name: 'Home', url: '/' },
              { name: 'Blog', url: '/blog' },
              { name: post.title, url: `/blog/${post.slug}` },
            ],
            baseUrl,
          }),
        ]}
      />
      <article>...</article>
    </>
  );
}
```

Output:

```html
<script type="application/ld+json">{"@context":"https://schema.org","@type":"Article",...}</script>
<script type="application/ld+json">{"@context":"https://schema.org","@type":"BreadcrumbList",...}</script>
```

## Why not just write the object by hand?

You can, and `<JsonLd>` accepts any `WithContext<Thing>` from [`schema-dts`](https://github.com/google/schema-dts). The builders exist to:

- **Catch relative URLs at build time.** `absoluteUrl('/about')` throws unless you pass `baseUrl`.
- **Strip `undefined`** so optional fields never leak into the output.
- **Escape `<`** so user content cannot break out of the script tag.
- **Give you a small, typed input shape** instead of the full schema.org surface area.

## Builders

| Builder          | schema.org type  | Notes                                           |
| ---------------- | ---------------- | ----------------------------------------------- |
| `organization()` | Organization     | logo, sameAs, contact details                   |
| `website()`      | WebSite          | optional sitelinks SearchAction                 |
| `breadcrumb()`   | BreadcrumbList   | positions auto-numbered from 1                  |
| `article()`      | Article          | dateModified defaults to datePublished          |
| `faq()`          | FAQPage          | question / answer pairs                         |
| `product()`      | Product          | Offer, availability, AggregateRating            |
| `service()`      | Service          | provider Organization, areaServed               |
| `localBusiness()`| LocalBusiness    | PostalAddress, GeoCoordinates, opening hours    |

Every builder accepts an optional `baseUrl`. Relative values in `url`, `image`, `logo`, `sameAs` and breadcrumb `item` are resolved against it. Absolute values pass through unchanged.

## `<JsonLd>` props

| Prop       | Type                                      | Default                          |
| ---------- | ----------------------------------------- | -------------------------------- |
| `data`     | `WithContext<Thing> \| WithContext<Thing>[]` | required                      |
| `id`       | `string`                                  | none (applied for single items)  |
| `validate` | `boolean`                                 | `true` unless `NODE_ENV=production` |

When `validate` is on, any string under a URL-like key (`url`, `item`, `image`, `logo`, `sameAs`, `contentUrl`, `thumbnailUrl`) that is not an absolute `http(s)` URL throws a `SchemaUrlError` naming the offending path, for example `itemListElement[2].item`.

## Site-wide schemas in `layout.tsx`

```tsx
import { JsonLd, organization, website } from 'next-seo-schema';

const baseUrl = 'https://example.com';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <JsonLd
          data={[
            organization({ name: 'Example', url: '/', logo: '/logo.png', baseUrl }),
            website({ name: 'Example', url: '/', searchUrlTemplate: '/search?q={search_term_string}', baseUrl }),
          ]}
        />
        {children}
      </body>
    </html>
  );
}
```

## Utilities

```ts
import { absoluteUrl, isAbsoluteUrl, assertAbsoluteUrls, serializeJsonLd, compact } from 'next-seo-schema';
```

## Testing your output

Paste the rendered HTML into Google's [Rich Results Test](https://search.google.com/test/rich-results) or the [Schema Markup Validator](https://validator.schema.org/).

## Contributing

```bash
npm install
npm test
npm run build
```

Issues and PRs welcome. Adding a builder is a single file in `src/schemas/` plus a test.

## License

MIT
