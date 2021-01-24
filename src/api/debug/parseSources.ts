import { join } from 'path';

import { workDir, packDir } from '../const';
import { PackArchive, SourceVariant, TranslationRecord } from '@/interfaces';
import { createArchiveFromMemory } from '../archiveUtils';
import { writeTranslation } from '../writeTranslation';
import { existsSync, readFileAsync, mkdirAsync } from '../nodeApi';

const sourceDir = join(workDir, 'sources');

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
  overridePack?: string,
): Promise<void> => {
  if (!existsSync(sourceDir)) {
    return;
  }
  const translationDir = join(packDir, variant);
  if (!existsSync(translationDir)) {
    await mkdirAsync(translationDir, { recursive: true });
  }
  const part = readSource(await readSourceRaw(variant, 'Part'));
  const full = readSource(await readSourceRaw(variant, 'Full'));

  const writePath = overridePack || variant;
  await writeTranslation(writePath, part, true, true);
  await writeTranslation(writePath, full, false, true);

  const archive: PackArchive = {
    version,
    full,
    part,
  };

  // Pack it
  await createArchiveFromMemory(writePath, archive);
};

export { parseSources, readSource };
