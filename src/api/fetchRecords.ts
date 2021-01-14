import { join } from 'path';
import { promises as fs } from 'fs';
import { TranslationRecord } from '@/interfaces/translationRecord';
import { packDir } from './const';

// TODO: lru-cache
let cache: any = {};

const fetchRecords = async (
  locale: string,
  source: string,
  filter?: string,
  pageIndex: number = 0,
  pageSize: number = 100,
  recache: boolean = false,
): Promise<TranslationRecord[]> => {
  let result: TranslationRecord[] = [];
  if (
    recache ||
    !cache[locale] ||
    !cache[locale][source] ||
    cache[locale][source].length <= 0
  ) {
    cache[locale] = {
      [source]: [],
    };
    const dir = join(packDir, locale, source);
    const stats = await fs.stat(dir);
    if (stats && stats.isDirectory()) {
      const all = await fs.readdir(dir);
      for (const file of all) {
        // TODO: Promise.all?
        const record: TranslationRecord = JSON.parse(
          await fs.readFile(join(dir, file), 'utf8'),
        );
        cache[locale][source].push(record);
      }
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
