import type { FAQPage, WithContext } from 'schema-dts';

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqInput {
  items: FaqItem[];
}

export function faq(input: FaqInput): WithContext<FAQPage> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: input.items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}
