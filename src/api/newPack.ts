import { mkdirAsync } from './nodeApi';

import { join } from 'path';
import { packDir } from './const';

const newPack = async (packName: string) => {
  await mkdirAsync(join(packDir, packName, 'full'), { recursive: true });
  await mkdirAsync(join(packDir, packName, 'part'), { recursive: true });
};

export { newPack };
