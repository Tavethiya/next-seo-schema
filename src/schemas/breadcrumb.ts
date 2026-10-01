import type { BreadcrumbList, WithContext } from 'schema-dts';
import { absoluteUrl } from '../url';

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface BreadcrumbInput {
  items: BreadcrumbItem[];
  baseUrl?: string;
}

export function breadcrumb(input: BreadcrumbInput): WithContext<BreadcrumbList> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: input.items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.url, input.baseUrl),
    })),
  };
}
