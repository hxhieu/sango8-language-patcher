import { join } from 'path';
import { workDir, packExt } from './const';
import lz from 'lzutf8';
import { PackArchive } from '@/interfaces';
import { loadLocalPack } from './localPackUtils';
import { readFileAsync, writeFileAsync, existsSync } from './nodeApi';

const writeArchive = async (locale: string, archive: PackArchive) => {
  const bytes: Buffer = lz.compress(Buffer.from(JSON.stringify(archive)));
  await writeFileAsync(join(workDir, `${locale}.${packExt}`), bytes);
};

const createArchiveFromMemory = writeArchive;

const createArchive = async (locale: string, version: any = 'devel') => {
  const archive = await loadLocalPack(locale, version);
  await writeArchive(locale, archive);
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

export { createArchive, readArchive, createArchiveFromMemory };
