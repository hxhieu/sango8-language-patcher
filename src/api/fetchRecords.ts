import isChinese from 'is-chinese';
import { TranslationRecord, FetchRecordArgs } from '@/interfaces';
import { readArchive } from './archiveUtils';
import { loadLocalPack } from './localPackUtils';
import { compare } from './stringUtils';
import * as cache from './translationCache';

const fetchRecords = async (
  args: FetchRecordArgs,
): Promise<[TranslationRecord[], number, boolean]> => {
  const {
    clearCache,
    local,
    source,
    search,
    fileType,
    pageIndex,
    pageSize,
    exact,
  } = args;
  // Defaults
  const sourceLocale = source || 'zh-tw';
  const localLocale = local || '';
  const fileTypeValue = fileType || 'full';

  let result: TranslationRecord[] = [];

  let localeCacheValue = cache.get(localLocale, fileTypeValue);
  let sourceCacheValue = cache.get(sourceLocale, fileTypeValue);

  // Reload the data if the cache is invalid
  if (clearCache || !localeCacheValue || !sourceCacheValue) {
    const sourcePack = await readArchive(sourceLocale);
    if (!sourcePack) {
      throw new Error(
        'Source packs are missing, please re-download them from the menu',
      );
    }
    cache.set(sourceLocale, fileTypeValue, sourcePack[fileTypeValue], false);

    const localPack = await loadLocalPack(localLocale);
    cache.set(localLocale, fileTypeValue, localPack[fileTypeValue], false);

    localeCacheValue = cache.get(localLocale, fileTypeValue);
    sourceCacheValue = cache.get(sourceLocale, fileTypeValue);
  }

  // Combine sources with translations
  const combined: TranslationRecord[] = [];
  Object.keys(sourceCacheValue).forEach(key => {
    const id = parseInt(key, 10);
    const source = sourceCacheValue[id];
    const trans = localeCacheValue[id];
    combined.push(trans || source);
  });

  // filter
  for (var record of combined) {
    if (search) {
      // Search keyword
      switch (search) {
        case '{{ MISSING }}':
          if (!record.text || isChinese(record.text)) {
            result.push(record);
          }
          continue;
        default:
          if (
            (record.text && compare(record.text, search, exact)) ||
            (record.original && compare(record.original, search, exact))
          ) {
            result.push(record);
          }
          continue;
      }
    }

    result.push(record);
  }

  const total = result.length;

  // sort
  result = result.sort((a, b) => (a.id > b.id ? 1 : -1));
  // paging
  result = result.splice(pageIndex * pageSize, pageSize);
  return [result, total, cache.hasPending()];
};

export { fetchRecords };
