import { join } from 'path';
import { packDir } from './const';
import { PackArchive } from '@/interfaces';
import { readdirAsync, statAsync, existsSync, readFileAsync } from './nodeApi';

const loadLocalPack = async (
  locale: string,
  version: any = 'local',
): Promise<PackArchive> => {
  const part = join(packDir, locale, 'part');
  const full = join(packDir, locale, 'full');
  if (!existsSync(part) || !existsSync(full)) {
    throw new Error(`Need both 'part' or 'full' for locale '${locale}'`);
  }
  const archive: PackArchive = {
    version,
  };
  let dir: string[];
  let reads: any[];

  // Load part file
  dir = await readdirAsync(part);
  reads = [];
  for (const file of dir) {
    reads.push(readFileAsync(join(part, file), 'utf8'));
  }
  archive.part = (await Promise.all(reads)).map(x => JSON.parse(x));

  // Load full
  dir = await readdirAsync(full);
  reads = [];
  for (const file of dir) {
    reads.push(readFileAsync(join(full, file), 'utf8'));
  }
  archive.full = (await Promise.all(reads)).map(x => JSON.parse(x));

  return archive;
};

const listPacks = async () => {
  const result: string[] = [];
  for (const dir of await readdirAsync(packDir)) {
    const stat = await statAsync(join(packDir, dir));
    if (stat.isDirectory()) {
      result.push(dir);
    }
  }

  return result;
};

export { loadLocalPack, listPacks };
