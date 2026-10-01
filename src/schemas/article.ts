import type { Article, WithContext } from 'schema-dts';
import { absoluteUrl } from '../url';

export interface ArticleInput {
  headline: string;
  url: string;
  description?: string;
  image?: string | string[];
  /** ISO 8601 date string */
  datePublished: string;
  dateModified?: string;
  author: { name: string; url?: string };
  publisher?: { name: string; logo?: string };
  baseUrl?: string;
}

export function article(input: ArticleInput): WithContext<Article> {
  const { baseUrl } = input;
  const images = input.image
    ? Array.isArray(input.image)
      ? input.image
      : [input.image]
    : undefined;
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: input.headline,
    description: input.description,
    image: images?.map((i) => absoluteUrl(i, baseUrl)),
    datePublished: input.datePublished,
    dateModified: input.dateModified ?? input.datePublished,
    mainEntityOfPage: { '@type': 'WebPage', '@id': absoluteUrl(input.url, baseUrl) },
    author: {
      '@type': 'Person',
      name: input.author.name,
      url: input.author.url ? absoluteUrl(input.author.url, baseUrl) : undefined,
    },
    publisher: input.publisher
      ? {
          '@type': 'Organization',
          name: input.publisher.name,
          logo: input.publisher.logo
            ? { '@type': 'ImageObject', url: absoluteUrl(input.publisher.logo, baseUrl) }
            : undefined,
        }
      : undefined,
  };
}
