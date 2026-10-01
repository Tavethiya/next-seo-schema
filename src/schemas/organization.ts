import type { Organization, WithContext } from 'schema-dts';
import { absoluteUrl } from '../url';

export interface OrganizationInput {
  name: string;
  url: string;
  logo?: string;
  description?: string;
  sameAs?: string[];
  email?: string;
  telephone?: string;
  /** Used to resolve relative paths in url, logo and sameAs. */
  baseUrl?: string;
}

export function organization(input: OrganizationInput): WithContext<Organization> {
  const { baseUrl } = input;
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: input.name,
    url: absoluteUrl(input.url, baseUrl),
    logo: input.logo ? absoluteUrl(input.logo, baseUrl) : undefined,
    description: input.description,
    sameAs: input.sameAs?.map((u) => absoluteUrl(u, baseUrl)),
    email: input.email,
    telephone: input.telephone,
  };
}
