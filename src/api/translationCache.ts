import { TranslationRecord } from '@/interfaces';

export interface TranslationCache {
  [key: number]: TranslationRecord;
}

const cache: { [key: string]: TranslationCache } = {};
let pendingRecords: { [key: number]: boolean } = {};

const getKey = (locale: string, fileType: string) => `${locale}_${fileType}`;

const set = (
  locale: string,
  fileType: string,
  records: TranslationRecord[],
  updatePending = true,
) => {
  if (!cache[getKey(locale, fileType)]) {
    cache[getKey(locale, fileType)] = {};
  }

  records.forEach(record => {
    cache[getKey(locale, fileType)][record.id] = record;
    if (updatePending) {
      pendingRecords[record.id] = true;
    }
  });
};

const get = (locale: string, fileType: string) => {
  return cache[getKey(locale, fileType)];
};

const getRecords = (locale: string, fileType: string, pendingOnly = true) => {
  const cacheValue = cache[getKey(locale, fileType)];
  const result: TranslationRecord[] = [];
  Object.keys(cacheValue).forEach(key => {
    const id = parseInt(key, 10);
    if (pendingOnly && pendingRecords[id]) {
      result.push(cacheValue[id]);
    }
  });
  return result;
};

const hasPending = () => Object.keys(pendingRecords).length > 0;
const clearPending = () => (pendingRecords = {});

export { get, set, getRecords, hasPending, clearPending };
