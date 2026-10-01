import type { Service, WithContext } from 'schema-dts';
import { absoluteUrl } from '../url';

export interface ServiceInput {
  name: string;
  url: string;
  description?: string;
  serviceType?: string;
  provider: { name: string; url: string };
  areaServed?: string | string[];
  baseUrl?: string;
}

export function service(input: ServiceInput): WithContext<Service> {
  const { baseUrl } = input;
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: input.name,
    url: absoluteUrl(input.url, baseUrl),
    description: input.description,
    serviceType: input.serviceType,
    provider: {
      '@type': 'Organization',
      name: input.provider.name,
      url: absoluteUrl(input.provider.url, baseUrl),
    },
    areaServed: input.areaServed,
  };
}
