import type { Product, WithContext } from 'schema-dts';
import { absoluteUrl } from '../url';

export interface ProductInput {
  name: string;
  url: string;
  description?: string;
  image?: string | string[];
  brand?: string;
  sku?: string;
  offer?: {
    price: number | string;
    priceCurrency: string;
    availability?: 'InStock' | 'OutOfStock' | 'PreOrder' | 'Discontinued';
    url?: string;
  };
  rating?: { value: number; count: number };
  baseUrl?: string;
}

export function product(input: ProductInput): WithContext<Product> {
  const { baseUrl } = input;
  const images = input.image
    ? Array.isArray(input.image)
      ? input.image
      : [input.image]
    : undefined;
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: input.name,
    url: absoluteUrl(input.url, baseUrl),
    description: input.description,
    image: images?.map((i) => absoluteUrl(i, baseUrl)),
    sku: input.sku,
    brand: input.brand ? { '@type': 'Brand', name: input.brand } : undefined,
    offers: input.offer
      ? {
          '@type': 'Offer',
          price: String(input.offer.price),
          priceCurrency: input.offer.priceCurrency,
          availability: input.offer.availability
            ? `https://schema.org/${input.offer.availability}`
            : undefined,
          url: absoluteUrl(input.offer.url ?? input.url, baseUrl),
        }
      : undefined,
    aggregateRating: input.rating
      ? {
          '@type': 'AggregateRating',
          ratingValue: input.rating.value,
          reviewCount: input.rating.count,
        }
      : undefined,
  } as WithContext<Product>;
}
