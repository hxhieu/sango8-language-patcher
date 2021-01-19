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
import { log } from './logger';

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
  const patchDir = join(workDir, 'patches');
  if (!existsSync(patchDir)) {
    await mkdirAsync(patchDir);
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

  log(`Patches done!`);

  // const { full: headerFull, part: headerPart } = JSON.parse(
  //   await readFileAsync(join(workDir, 'headers.json'), { encoding: 'utf8' }),
  // ) as PatchHeader;
  // const { full, part } = (await loadLocalPack(locale)) as PackArchive;

  // let fullText = `[ 25693,
  // 0,
  // 0,
  // ["id","text"],
  // `;

  // full
  //   .sort((x, y) => (x.id > y.id ? 1 : -1))
  //   .forEach(x => {
  //     const { id, text, original } = x;
  //     const patch = (text || original || '').trim();
  //     fullText += `  [${id}:"${patch}"],\n`;
  //   });
  // fullText += `]`;
  // await writeFileAsync(join(workDir, `Strings_Full.${variant}.txt`), fullText);

  // part.forEach(x => {
  //   const { id, text, original } = x;
  //   const patch = (text || original || '').trim();
  //   headerPart.push([id, patch]);
  // });
  // await writeFileAsync(
  //   join(workDir, `Strings_Part.${variant}.txt`),
  //   JSON.stringify(headerPart, null, 2),
  // );
};

export { createPatches };
