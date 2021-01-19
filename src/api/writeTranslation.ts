import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

import { TranslationRecord } from '@/interfaces';
import { packDir } from './const';
import { log } from './logger';
import { writeFileAsync } from './nodeApi';

const writeTranslation = async (
  locale: string,
  records: TranslationRecord[],
  part = false,
  sendLog = false,
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
        JSON.stringify(record),
      ),
    );
  }
  const translationId = `${locale}.${translationType}`;
  await Promise.all(batch);
  if (sendLog) {
    log(`The record(s) for '${translationId}' has been saved`, 'success');
  }
};

export { writeTranslation };
