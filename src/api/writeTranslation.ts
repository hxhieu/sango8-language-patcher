import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { writeFile } from 'graceful-fs';
import { promisify } from 'util';

import { TranslationRecord } from '@/interfaces/translationRecord';
import { packDir } from './const';
import { log } from './logger';

const writeFileAsync = promisify(writeFile);

const writeTranslation = async (
  locale: string,
  records: TranslationRecord[],
  part = false,
): Promise<void> => {
  const translationDir = join(packDir, locale);
  if (!existsSync(translationDir)) {
    mkdirSync(translationDir, { recursive: true });
  }
  const translationType = part ? 'part' : 'full';
  const recordDir = join(translationDir, translationType);
  if (!existsSync(recordDir)) {
    mkdirSync(recordDir);
  }

  const batch = [];
  for (const record of records) {
    batch.push(
      writeFileAsync(
        join(recordDir, `${record.id}.json`),
        JSON.stringify(record, null, 2),
      ),
    );
  }
  const translationId = `${locale}.${translationType}`;
  log(`Start saving translation records: ${translationId}...`);
  await Promise.all(batch);
  log(`Start saving translation records: ${translationId}...DONE`, 'success');
};

export { writeTranslation };
