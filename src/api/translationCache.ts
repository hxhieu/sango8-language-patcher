import { TranslationRecord } from '@/interfaces';

export interface TranslationCache {
  [key: number]: TranslationRecord;
}

const cache: { [key: string]: TranslationCache } = {};

const getKey = (locale: string, fileType: string) => `${locale}_${fileType}`;

const set = (
  locale: string,
  fileType: string,
  records: TranslationRecord[],
) => {
  if (!cache[getKey(locale, fileType)]) {
    cache[getKey(locale, fileType)] = {};
  }
  records.forEach(
    record => (cache[getKey(locale, fileType)][record.id] = record),
  );
};

const get = (locale: string, fileType: string) => {
  return cache[getKey(locale, fileType)];
};

export { get, set };
