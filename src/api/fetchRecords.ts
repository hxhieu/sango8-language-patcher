import { TranslationRecord, PackArchive, FetchRecordArgs } from '@/interfaces';
import { readArchive } from './archiveUtils';
import { loadLocalPack } from './localPackUtils';
import { compare } from './stringUtils';

// TODO: separate cache module, lru-cache?
let cache: { [key: string]: PackArchive } = {};

const fetchRecords = async (
  locale: string,
  args: FetchRecordArgs,
  invalidateCache: boolean = false,
): Promise<TranslationRecord[]> => {
  let result: TranslationRecord[] = [];
  // Load the data
  if (invalidateCache || !cache[locale]) {
    // Source packs
    if (locale === 'zh-tw' || locale === 'zh-cn') {
      const sourcePack = await readArchive(locale);
      if (!sourcePack) {
        throw new Error(
          'Source packs are missing, please re-download them from the menu',
        );
      }
      cache[locale] = sourcePack;
    } else {
      cache[locale] = await loadLocalPack(locale);
    }
  }

  const { search, fileType, pageIndex, pageSize, exact } = args;

  // filter
  for (var record of cache[locale][fileType || 'full']) {
    if (search) {
      if (
        (record.text && compare(record.text, search, exact)) ||
        (record.original && compare(record.original, search, exact))
      ) {
        result.push(record);
      }
    } else {
      result.push(record);
    }
  }

  // sort
  result = result.sort((a, b) => (a.id > b.id ? 1 : -1));
  // paging
  result = result.splice(pageIndex, pageSize);
  return result;
};

export { fetchRecords };
