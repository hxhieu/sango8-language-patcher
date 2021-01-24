import { blockUi, unblockUi } from '@/api/blockUi';
import { createPatches } from '@/api/createPatches';
import { listPacks } from '@/api/localPackUtils';
import { log } from '@/api/logger';
import { SourceVariant } from '@/interfaces';
import { MenuItemConstructorOptions } from 'electron';

const createPatch = async (variant: SourceVariant, locale: string) => {
  try {
    blockUi('Creating patches');
    await createPatches(locale, variant);
  } catch (err) {
    log(err.message, 'error');
  } finally {
    unblockUi();
  }
};

const buildCreatePatchSubmenu = async (
  variant: SourceVariant,
): Promise<MenuItemConstructorOptions[]> => {
  const packs = await listPacks();
  return packs.map(x => ({
    label: `From ${x}`,
    click: () => createPatch(variant, x),
  }));
};

export { buildCreatePatchSubmenu };
