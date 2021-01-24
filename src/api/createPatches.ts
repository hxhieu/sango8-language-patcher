import {
  readFileAsync,
  writeFileAsync,
  existsSync,
  mkdirAsync,
} from './nodeApi';

import { join } from 'path';
import { workDir } from './const';
import { SourceVariant, TranslationRecord } from '@/interfaces';
import { normaliseTranslations } from './nomaliseTranslation';
import { fetchRecords } from './fetchRecords';

let patchDir: string;

const setPatchDir = (targetDir: string) => (patchDir = targetDir);
const getPatchDir = () => patchDir;

const getSourceFileName = (variant: SourceVariant, fileType: 'Full' | 'Part') =>
  `Strings_${fileType}.${variant}.txt`;

const patch = (source: any[], records: TranslationRecord[]) => {
  const translations = normaliseTranslations(records);
  for (const record of source) {
    const id = parseInt(record[0]);
    // Skip irrelevant lines
    if (!Array.isArray(record) || isNaN(id) || !translations[id]) {
      continue;
    }
    // Apply translation
    record[1] = translations[id];
  }
};

const createPatches = async (
  locale: string,
  variant: SourceVariant,
  from = 0,
  count?: number,
) => {
  const dir = patchDir || join(workDir, 'patches');
  if (!existsSync(dir)) {
    await mkdirAsync(dir);
  }

  const sourceDir = join(workDir, 'sources');

  // TODO: Combine code
  // Full
  const fullSourceFile = getSourceFileName(variant, 'Full');
  const fullSource: any[] = JSON.parse(
    await readFileAsync(join(sourceDir, fullSourceFile), 'utf8'),
  );
  const [full] = await fetchRecords({
    local: locale,
    source: variant,
    pageIndex: from,
    pageSize: count || Number.MAX_SAFE_INTEGER,
    exact: false,
    fileType: 'full',
  });
  patch(fullSource, full);
  await writeFileAsync(
    join(patchDir, fullSourceFile),
    JSON.stringify(fullSource, null, 2),
    'utf8',
  );

  // Part
  const partSourceFile = getSourceFileName(variant, 'Part');
  const partSource: any[] = JSON.parse(
    await readFileAsync(join(sourceDir, partSourceFile), 'utf8'),
  );
  const [part] = await fetchRecords({
    local: locale,
    source: variant,
    pageIndex: from,
    pageSize: count || Number.MAX_SAFE_INTEGER,
    exact: false,
    fileType: 'part',
  });
  patch(partSource, part);
  await writeFileAsync(
    join(patchDir, partSourceFile),
    JSON.stringify(partSource, null, 2),
    'utf8',
  );
};

export { createPatches, setPatchDir, getPatchDir };
