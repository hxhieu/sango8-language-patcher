import { join } from 'path';
import { existsSync, mkdirSync, readFile } from 'fs';
import { promisify } from 'util';

import { workDir } from './const';
import { TranslationRecord } from '@/interfaces/translationRecord';
import { writeTranslation } from './writeTranslation';

const sourceDir = join(workDir, 'sources');
const packDir = join(workDir, 'packs');

const readFileAsync = promisify(readFile);

// It starts from the 4th record
// in the raw text file
const START_RECORD = 4;

const readSourceRaw = async (variant: string, source: string): Promise<string | undefined> => {
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
        text: raw[1],
      });
    }
  }

  return result;
};

const parseSources = async (variant: string): Promise<void> => {
  if (variant !== 'zh-tw' && variant !== 'zh-cn') {
    return;
  }
  if (!existsSync(sourceDir)) {
    return;
  }
  const translationDir = join(packDir, variant);
  if (!existsSync(translationDir)) {
    mkdirSync(translationDir, { recursive: true });
  }
  const partSrc = readSource(await readSourceRaw(variant, 'Part'));
  const fullSrc = readSource(await readSourceRaw(variant, 'Full'));
  await writeTranslation(variant, partSrc, true);
  await writeTranslation(variant, fullSrc);
};

export { parseSources };
