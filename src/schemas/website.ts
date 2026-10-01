import type { WebSite, WithContext } from 'schema-dts';
import { absoluteUrl } from '../url';

export interface WebSiteInput {
  name: string;
  url: string;
  /** Search URL template, e.g. "https://example.com/search?q={search_term_string}" */
  searchUrlTemplate?: string;
  baseUrl?: string;
}

export function website(input: WebSiteInput): WithContext<WebSite> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: input.name,
    url: absoluteUrl(input.url, input.baseUrl),
    potentialAction: input.searchUrlTemplate
      ? {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: absoluteUrl(input.searchUrlTemplate, input.baseUrl),
          },
          'query-input': 'required name=search_term_string',
        }
      : undefined,
  } as WithContext<WebSite>;
}
