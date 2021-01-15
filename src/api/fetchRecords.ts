import { TranslationRecord } from '@/interfaces/translationRecord';
import { PackArchive } from '@/interfaces/packArchive';
import { readArchive } from './archiveUtils';
import { loadLocalPack } from './localPackUtils';

// TODO: lru-cache
let cache: { [key: string]: PackArchive } = {};

const fetchRecords = async (
  locale: string,
  source: string,
  filter?: string,
  pageIndex: number = 0,
  pageSize: number = 100,
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

  // filter
  for (var record of cache[locale][source])
    if (
      filter &&
      ((record.text && record.text.indexOf(filter) >= 0) ||
        (record.original && record.original.indexOf(filter) >= 0))
    ) {
      result.push(record);
    } else {
      result.push(record);
    }

  // sort
  result = result.sort((a, b) => (a.id > b.id ? 1 : -1));
  // paging
  result = result.splice(pageIndex, pageSize);

  console.log(result.map(x => x.id));

  return result;
};

export { fetchRecords };
