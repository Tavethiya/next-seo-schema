import type { LocalBusiness, WithContext } from 'schema-dts';
import { absoluteUrl } from '../url';

export type DayOfWeek =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday';

export interface LocalBusinessInput {
  name: string;
  url: string;
  description?: string;
  image?: string;
  telephone?: string;
  email?: string;
  priceRange?: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion?: string;
    postalCode: string;
    addressCountry: string;
  };
  geo?: { latitude: number; longitude: number };
  openingHours?: Array<{ days: DayOfWeek[]; opens: string; closes: string }>;
  sameAs?: string[];
  baseUrl?: string;
}

export function localBusiness(input: LocalBusinessInput): WithContext<LocalBusiness> {
  const { baseUrl } = input;
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: input.name,
    url: absoluteUrl(input.url, baseUrl),
    description: input.description,
    image: input.image ? absoluteUrl(input.image, baseUrl) : undefined,
    telephone: input.telephone,
    email: input.email,
    priceRange: input.priceRange,
    address: { '@type': 'PostalAddress', ...input.address },
    geo: input.geo ? { '@type': 'GeoCoordinates', ...input.geo } : undefined,
    openingHoursSpecification: input.openingHours?.map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: h.days,
      opens: h.opens,
      closes: h.closes,
    })),
    sameAs: input.sameAs?.map((u) => absoluteUrl(u, baseUrl)),
  } as WithContext<LocalBusiness>;
}
