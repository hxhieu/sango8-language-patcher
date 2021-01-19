import {
  readFileAsync,
  writeFileAsync,
  existsSync,
  mkdirAsync,
} from './nodeApi';

import { join } from 'path';
import { workDir } from './const';
import {
  PackArchive,
  PatchHeader,
  SourceVariant,
  TranslationRecord,
} from '@/interfaces';
import { loadLocalPack } from './localPackUtils';

const getSourceFileName = (variant: SourceVariant, part = false) =>
  `Strings_${part ? 'Part' : 'Full'}.${variant}.txt`;

const createPatches = async (locale: string, variant: SourceVariant) => {
  const fullFile = getSourceFileName(variant, false);
  const patchDir = join(workDir, 'patches');
  if (!existsSync(patchDir)) {
    await mkdirAsync(patchDir);
  }

  const fullSource: any[] = JSON.parse(
    await readFileAsync(join(workDir, fullFile), 'utf8'),
  );
  const { full, part } = (await loadLocalPack(locale)) as PackArchive;

  // // Full patch
  // const fullTranslate = normaliseTranslations(full);
  // for (const record of fullSource) {
  //   // Skip irrelevant lines
  //   if (!Array.isArray(record) || isNaN(parseInt(record[0]))) {
  //     continue;
  //   }
  //   record[1] = fullTranslate[record[0]];
  // }

  await writeFileAsync(
    join(patchDir, fullFile),
    JSON.stringify(fullSource),
    'utf8',
  );
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
