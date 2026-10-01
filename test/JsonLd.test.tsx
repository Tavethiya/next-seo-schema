import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { JsonLd, breadcrumb, organization, serializeJsonLd } from '../src';

describe('serializeJsonLd', () => {
  it('escapes < so script tags cannot break out', () => {
    expect(serializeJsonLd({ name: '</script><b>' })).toBe(
      '{"name":"\\u003c/script>\\u003cb>"}'
    );
  });
});

describe('JsonLd', () => {
  it('renders a single application/ld+json script with id', () => {
    const html = renderToStaticMarkup(
      <JsonLd id="org" data={organization({ name: 'Acme', url: 'https://example.com' })} />
    );
    expect(html).toContain('<script id="org" type="application/ld+json">');
    expect(html).toContain('"@type":"Organization"');
    expect(html).not.toContain('"logo"');
  });

  it('renders one script per item for arrays', () => {
    const html = renderToStaticMarkup(
      <JsonLd
        data={[
          organization({ name: 'Acme', url: 'https://example.com' }),
          breadcrumb({ items: [{ name: 'Home', url: 'https://example.com' }] }),
        ]}
      />
    );
    expect(html.match(/<script/g)?.length).toBe(2);
  });

  it('throws on relative URLs when validate is on', () => {
    expect(() =>
      renderToStaticMarkup(
        <JsonLd
          validate
          data={{ '@context': 'https://schema.org', '@type': 'WebPage', url: '/relative' }}
        />
      )
    ).toThrow(/url must be an absolute URL/);
  });

  it('skips validation when validate is false', () => {
    const html = renderToStaticMarkup(
      <JsonLd
        validate={false}
        data={{ '@context': 'https://schema.org', '@type': 'WebPage', url: '/relative' }}
      />
    );
    expect(html).toContain('/relative');
  });
});
