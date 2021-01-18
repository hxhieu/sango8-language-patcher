import { readFileAsync, writeFileAsync } from './nodeApi';

import { join } from 'path';
import { workDir } from './const';
import { PackArchive, PatchHeader, SourceVariant } from '@/interfaces';
import { loadLocalPack } from './localPackUtils';

const createPatches = async (locale: string, variant: SourceVariant) => {
  const { full: headerFull, part: headerPart } = JSON.parse(
    await readFileAsync(join(workDir, 'headers.json'), { encoding: 'utf8' }),
  ) as PatchHeader;
  const { full, part } = (await loadLocalPack(locale)) as PackArchive;

  let fullText = `[ 25693,
  0,
  0,
  ["id","text"],  
  `;

  full
    .sort((x, y) => (x.id > y.id ? 1 : -1))
    .forEach(x => {
      const { id, text, original } = x;
      const patch = (text || original || '').trim();
      fullText += `  [${id}:"${patch}"],\n`;
    });
  fullText += `]`;
  await writeFileAsync(join(workDir, `Strings_Full.${variant}.txt`), fullText);

  part.forEach(x => {
    const { id, text, original } = x;
    const patch = (text || original || '').trim();
    headerPart.push([id, patch]);
  });
  await writeFileAsync(
    join(workDir, `Strings_Part.${variant}.txt`),
    JSON.stringify(headerPart, null, 2),
  );
};

export { createPatches };
