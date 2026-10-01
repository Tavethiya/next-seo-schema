export { JsonLd } from './JsonLd';
export type { JsonLdProps } from './JsonLd';

export { absoluteUrl, isAbsoluteUrl, assertAbsoluteUrls, SchemaUrlError } from './url';
export { serializeJsonLd, compact } from './serialize';

export { organization } from './schemas/organization';
export type { OrganizationInput } from './schemas/organization';
export { website } from './schemas/website';
export type { WebSiteInput } from './schemas/website';
export { breadcrumb } from './schemas/breadcrumb';
export type { BreadcrumbInput, BreadcrumbItem } from './schemas/breadcrumb';
export { article } from './schemas/article';
export type { ArticleInput } from './schemas/article';
export { faq } from './schemas/faq';
export type { FaqInput, FaqItem } from './schemas/faq';
export { product } from './schemas/product';
export type { ProductInput } from './schemas/product';
export { service } from './schemas/service';
export type { ServiceInput } from './schemas/service';
export { localBusiness } from './schemas/localBusiness';
export type { LocalBusinessInput, DayOfWeek } from './schemas/localBusiness';

export type { Thing, WithContext } from 'schema-dts';
