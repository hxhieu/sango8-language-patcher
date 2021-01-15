import { join } from 'path';
import { workDir, packExt } from './const';
import { existsSync, readFile, writeFile } from 'graceful-fs';
import { promisify } from 'util';
import lz from 'lzutf8';
import { PackArchive } from '@/interfaces/packArchive';
import { loadLocalPack } from './localPackUtils';

const readFileAsync = promisify(readFile);
const writeFileAsync = promisify(writeFile);

const createArchive = async (locale: string, version: any = 'devel') => {
  const archive = await loadLocalPack(locale, version);
  const bytes: Buffer = lz.compress(Buffer.from(JSON.stringify(archive)));
  await writeFileAsync(join(workDir, `${locale}.${packExt}`), bytes);
};

const readArchive = async (
  locale: string,
): Promise<PackArchive | undefined> => {
  const filePath = join(workDir, `${locale}.${packExt}`);
  if (existsSync(filePath)) {
    const bytes = await readFileAsync(filePath);
    const json = lz.decompress(bytes);
    return JSON.parse(json);
  }
};

export { createArchive, readArchive };
