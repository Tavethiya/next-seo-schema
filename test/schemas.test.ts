import { describe, expect, it } from 'vitest';
import {
  article,
  breadcrumb,
  compact,
  faq,
  localBusiness,
  organization,
  product,
  service,
  website,
} from '../src';

const baseUrl = 'https://example.com';

/** JSON round-trip so tests can assert on plain objects instead of schema-dts unions. */
const json = (value: unknown): Record<string, unknown> => JSON.parse(JSON.stringify(value));

describe('organization', () => {
  it('builds an Organization with absolute URLs', () => {
    const out = organization({
      name: 'Acme',
      url: '/',
      logo: '/logo.png',
      sameAs: ['https://x.com/acme', '/dribbble'],
      baseUrl,
    });
    expect(json(out)).toMatchObject({
      '@type': 'Organization',
      url: 'https://example.com/',
      logo: 'https://example.com/logo.png',
      sameAs: ['https://x.com/acme', 'https://example.com/dribbble'],
    });
  });
});

describe('website', () => {
  it('adds a SearchAction when a template is given', () => {
    const out = website({
      name: 'Acme',
      url: baseUrl,
      searchUrlTemplate: '/search?q={search_term_string}',
      baseUrl,
    });
    expect(JSON.stringify(out)).toContain('SearchAction');
    expect(JSON.stringify(out)).toContain('https://example.com/search?q=');
  });

  it('omits potentialAction without a template after compact', () => {
    const out = compact(website({ name: 'Acme', url: baseUrl }));
    expect('potentialAction' in out).toBe(false);
  });
});

describe('breadcrumb', () => {
  it('numbers positions from 1 and resolves item URLs', () => {
    const out = breadcrumb({
      items: [
        { name: 'Home', url: '/' },
        { name: 'Blog', url: '/blog' },
      ],
      baseUrl,
    });
    expect(json(out)).toMatchObject({
      itemListElement: [
        { position: 1, item: 'https://example.com/' },
        { position: 2, item: 'https://example.com/blog' },
      ],
    });
  });

  it('throws on relative URL without baseUrl', () => {
    expect(() => breadcrumb({ items: [{ name: 'Home', url: '/' }] })).toThrow();
  });
});

describe('article', () => {
  it('defaults dateModified to datePublished and wraps a single image', () => {
    const out = article({
      headline: 'Hello',
      url: '/blog/hello',
      image: '/cover.jpg',
      datePublished: '2026-01-01',
      author: { name: 'Jane' },
      publisher: { name: 'Acme', logo: '/logo.png' },
      baseUrl,
    });
    expect(json(out)).toMatchObject({
      dateModified: '2026-01-01',
      image: ['https://example.com/cover.jpg'],
    });
    expect(JSON.stringify(out)).toContain('https://example.com/logo.png');
  });
});

describe('faq', () => {
  it('maps items to Question/Answer', () => {
    const out = faq({ items: [{ question: 'Q?', answer: 'A.' }] });
    expect(json(out)['@type']).toBe('FAQPage');
    expect(JSON.stringify(out)).toContain('"acceptedAnswer":{"@type":"Answer","text":"A."}');
  });
});

describe('product', () => {
  it('expands availability to a schema.org URL and stringifies price', () => {
    const out = product({
      name: 'Widget',
      url: '/widget',
      offer: { price: 9.99, priceCurrency: 'USD', availability: 'InStock' },
      rating: { value: 4.5, count: 12 },
      baseUrl,
    });
    const json = JSON.stringify(out);
    expect(json).toContain('"price":"9.99"');
    expect(json).toContain('https://schema.org/InStock');
    expect(json).toContain('"url":"https://example.com/widget"');
    expect(json).toContain('"reviewCount":12');
  });
});

describe('service', () => {
  it('nests the provider as an Organization', () => {
    const out = service({
      name: 'Web Dev',
      url: '/services/web',
      provider: { name: 'Acme', url: '/' },
      baseUrl,
    });
    expect(JSON.stringify(out)).toContain('"provider":{"@type":"Organization"');
  });
});

describe('localBusiness', () => {
  it('builds address, geo and opening hours', () => {
    const out = localBusiness({
      name: 'Acme',
      url: baseUrl,
      address: {
        streetAddress: '1 Main St',
        addressLocality: 'Town',
        postalCode: '00000',
        addressCountry: 'US',
      },
      geo: { latitude: 1, longitude: 2 },
      openingHours: [{ days: ['Monday', 'Friday'], opens: '09:00', closes: '17:00' }],
    });
    const json = JSON.stringify(out);
    expect(json).toContain('"@type":"PostalAddress"');
    expect(json).toContain('"@type":"GeoCoordinates"');
    expect(json).toContain('"dayOfWeek":["Monday","Friday"]');
  });
});
