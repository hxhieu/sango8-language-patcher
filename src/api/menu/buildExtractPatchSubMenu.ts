import { basename } from 'path';
import { blockUi, unblockUi } from '@/api/blockUi';
import { listPacks } from '@/api/localPackUtils';
import { log } from '@/api/logger';
import { SourceVariant } from '@/interfaces';
import { dialog, MenuItemConstructorOptions } from 'electron';
import { readSource } from '../debug/parseSources';
import { readFileAsync } from '../nodeApi';
import { normaliseTranslations } from '../nomaliseTranslation';
import { readArchive } from '../archiveUtils';
import { writeTranslation } from '../writeTranslation';

const extractPatch = async (dir: string) => {
  const file = await dialog.showOpenDialog({
    properties: ['openFile'],
  });
  if (file && file.filePaths && file.filePaths[0]) {
    try {
      blockUi('Extracting patch file');
      const filePath = file.filePaths[0];
      const content = await readFileAsync(filePath, 'utf8');
      const records = normaliseTranslations(readSource(content));

      const segs = basename(filePath).split('.');
      const variant = segs[1];
      const fileType = segs[0].split('_')[1].toLowerCase();
      const sourceArchive = await readArchive(variant);
      if (sourceArchive && sourceArchive[fileType]) {
        const sources = sourceArchive[fileType];
        for (var source of sources) {
          source.text = records[source.id];
        }
        // Just need to replicate the process
        const part = fileType === 'part';
        // Real records
        await writeTranslation(dir, sources, part);
        // Fake records for the counter-part
        await writeTranslation(dir, [], !part);
      }
    } catch (err) {
      log(err.message, 'error');
    } finally {
      unblockUi();
    }
  }
};

const buildExtractPatchSubmenu = async (): Promise<MenuItemConstructorOptions[]> => {
  const packs = await listPacks();
  return packs.map(x => ({
    label: `To ${x}`,
    click: () => extractPatch(x),
  }));
};

export { buildExtractPatchSubmenu };
