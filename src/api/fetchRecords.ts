import { TranslationRecord, PackArchive, FetchRecordArgs } from '@/interfaces';
import { readArchive } from './archiveUtils';
import { loadLocalPack } from './localPackUtils';
import { compare } from './stringUtils';

// TODO: separate cache module, lru-cache?
let cache: { [key: string]: PackArchive } = {};

const fetchRecords = async (
  args: FetchRecordArgs,
  invalidateCache: boolean = false,
): Promise<[TranslationRecord[], number]> => {
  const { local, source, search, fileType, pageIndex, pageSize, exact } = args;
  // Defaults
  const sourceLocale = source || 'zh-tw';
  const localLocale = local || '';
  const fileTypeValue = fileType || 'full';

  let result: TranslationRecord[] = [];

  // Reload the data if the cache is invalid
  if (invalidateCache || !cache[localLocale] || !cache[sourceLocale]) {
    const sourcePack = await readArchive(sourceLocale);
    if (!sourcePack) {
      throw new Error(
        'Source packs are missing, please re-download them from the menu',
      );
    }
    cache[sourceLocale] = sourcePack;
    cache[localLocale] = await loadLocalPack(localLocale);
  }

  // Combine sources with translations
  const combined: TranslationRecord[] = [];
  for (const source of cache[sourceLocale][fileTypeValue]) {
    const translated = cache[localLocale][fileTypeValue].find(
      x => x.id === source.id,
    );
    combined.push(translated || source);
  }

  // filter
  for (var record of combined) {
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

  const total = result.length;

  // sort
  result = result.sort((a, b) => (a.id > b.id ? 1 : -1));
  // paging
  result = result.splice(pageIndex * pageSize, pageSize);
  return [result, total];
};

export { fetchRecords };
