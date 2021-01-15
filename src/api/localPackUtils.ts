import { join } from 'path';
import { packDir } from './const';
import { existsSync, readFile, readdir } from 'graceful-fs';
import { promisify } from 'util';
import { PackArchive } from '@/interfaces/packArchive';

const readFileAsync = promisify(readFile);
const readDirAsync = promisify(readdir);

const loadLocalPack = async (
  locale: string,
  version: any = 'local',
): Promise<PackArchive> => {
  const part = join(packDir, locale, 'part');
  const full = join(packDir, locale, 'full');
  if (!existsSync(part) || !existsSync(full)) {
    throw new Error(`Need both 'part' and 'full' for locale '${locale}'`);
  }
  const archive: PackArchive = {
    version,
  };

  // Load part file
  let dir = await readDirAsync(part);
  let reads = [];
  for (const file of dir) {
    reads.push(readFileAsync(join(part, file), 'utf8'));
  }
  archive.part = (await Promise.all(reads)).map(x => JSON.parse(x));

  // Load full
  dir = await readDirAsync(full);
  reads = [];
  for (const file of dir) {
    reads.push(readFileAsync(join(full, file), 'utf8'));
  }
  archive.full = (await Promise.all(reads)).map(x => JSON.parse(x));

  return archive;
};

export { loadLocalPack };
