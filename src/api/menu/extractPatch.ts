import { basename } from 'path';
import { readArchive } from '@/api/archiveUtils';
import { blockUi, unblockUi } from '@/api/blockUi';
import { readSource } from '@/api/debug/parseSources';
import { log } from '@/api/logger';
import { readFileAsync } from '@/api/nodeApi';
import { normaliseTranslations } from '@/api/nomaliseTranslation';
import { writeTranslation } from '@/api/writeTranslation';
import { dialog } from 'electron';

const extractPatch = async () => {
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
        await writeTranslation(`${variant}.extracted`, sources, part);
        // Fake records for the counter-part
        await writeTranslation(`${variant}.extracted`, [], !part);
      }
    } catch (err) {
      log(err.message, 'error');
    } finally {
      unblockUi();
    }
  }
};

export { extractPatch };
