import { TranslationRecord } from '@/interfaces';

const normaliseTranslations = (
  records: TranslationRecord[],
  field = 'text',
): { [key: number]: string } => {
  const result: { [key: number]: string } = {};
  records.forEach((x: any) => {
    result[x.id] = (x[field] || x.original || '').trim();
  });
  return result;
};

export { normaliseTranslations };
