import { join } from 'path';
import { existsSync, mkdirSync, readFile } from 'fs';
import { promisify } from 'util';

import { workDir, packDir } from '../const';
import { PackArchive, SourceVariant, TranslationRecord } from '@/interfaces';
import { createArchiveFromMemory } from '../archiveUtils';
import { writeTranslation } from '../writeTranslation';

const sourceDir = join(workDir, 'sources');

// TODO: Make helper for these
const readFileAsync = promisify(readFile);

// It starts from the 4th record
// in the raw text file
const START_RECORD = 4;

const readSourceRaw = async (
  variant: string,
  source: string,
): Promise<string | undefined> => {
  const partFilePath = join(sourceDir, `Strings_${source}.${variant}.txt`);
  if (existsSync(partFilePath)) {
    return await readFileAsync(partFilePath, 'utf-8');
  }
};

const readSource = (source?: string): TranslationRecord[] => {
  const result: TranslationRecord[] = [];
  if (source) {
    const arr = JSON.parse(source);
    for (let i = START_RECORD; i < arr.length; i++) {
      const raw = arr[i];
      result.push({
        id: raw[0],
        // Need to escape JSON here
        original: (raw[1] as string)
          .replace(/"/g, "'")
          .replace(/(?:\r\n|\r|\n)/g, ''),
      });
    }
  }

  return result;
};

const parseSources = async (
  variant: SourceVariant,
  version: any = 'devel',
): Promise<void> => {
  if (!existsSync(sourceDir)) {
    return;
  }
  const translationDir = join(packDir, variant);
  if (!existsSync(translationDir)) {
    mkdirSync(translationDir, { recursive: true });
  }
  const part = readSource(await readSourceRaw(variant, 'Part'));
  const full = readSource(await readSourceRaw(variant, 'Full'));

  await writeTranslation(variant, part, true, true);
  await writeTranslation(variant, full, false, true);

  const archive: PackArchive = {
    version,
    full,
    part,
  };

  // Pack it
  await createArchiveFromMemory(variant, archive);
};

export { parseSources };
