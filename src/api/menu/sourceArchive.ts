import { blockUi, unblockUi } from '@/api/blockUi';
import { parseSources } from '@/api/debug/parseSources';
import { log } from '@/api/logger';
import { SourceVariant } from '@/interfaces';

const sourceArchive = async (variant: SourceVariant) => {
  try {
    blockUi('Archiving the source files');
    await parseSources(variant);
  } catch (err) {
    log(err.message, 'error');
  } finally {
    unblockUi();
  }
};

export { sourceArchive };
