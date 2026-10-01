import { describe, expect, it } from 'vitest';
import { absoluteUrl, assertAbsoluteUrls, isAbsoluteUrl, SchemaUrlError } from '../src';

describe('isAbsoluteUrl', () => {
  it('accepts http and https URLs', () => {
    expect(isAbsoluteUrl('https://example.com')).toBe(true);
    expect(isAbsoluteUrl('http://example.com/path?q=1')).toBe(true);
  });

  it('rejects relative paths and other schemes', () => {
    expect(isAbsoluteUrl('/about')).toBe(false);
    expect(isAbsoluteUrl('about')).toBe(false);
    expect(isAbsoluteUrl('ftp://example.com')).toBe(false);
    expect(isAbsoluteUrl('')).toBe(false);
  });
});

describe('absoluteUrl', () => {
  it('returns absolute URLs untouched', () => {
    expect(absoluteUrl('https://example.com/a')).toBe('https://example.com/a');
  });

  it('resolves relative paths against baseUrl', () => {
    expect(absoluteUrl('/about', 'https://example.com')).toBe('https://example.com/about');
    expect(absoluteUrl('blog/post', 'https://example.com/')).toBe('https://example.com/blog/post');
  });

  it('throws on relative path without baseUrl', () => {
    expect(() => absoluteUrl('/about')).toThrow(SchemaUrlError);
  });

  it('throws on a relative baseUrl', () => {
    expect(() => absoluteUrl('/about', '/base')).toThrow(SchemaUrlError);
  });
});

describe('assertAbsoluteUrls', () => {
  it('passes for nested absolute URLs', () => {
    expect(() =>
      assertAbsoluteUrls({
        url: 'https://a.com',
        publisher: { logo: { url: 'https://a.com/logo.png' } },
        sameAs: ['https://x.com/a', 'https://y.com/a'],
      })
    ).not.toThrow();
  });

  it('reports the path of a relative URL', () => {
    expect(() =>
      assertAbsoluteUrls({ itemListElement: [{ item: 'https://a.com' }, { item: '/b' }] })
    ).toThrow(/itemListElement\[1\]\.item/);
  });

  it('ignores non-URL keys', () => {
    expect(() => assertAbsoluteUrls({ name: '/not-a-url' })).not.toThrow();
  });
});
