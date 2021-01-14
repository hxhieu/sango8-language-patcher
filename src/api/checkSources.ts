import { join } from 'path';
import { existsSync } from 'fs';

import { packDir } from './const';

const checkSources = (): boolean => {
  if (
    existsSync(join(packDir, 'zh-cn')) ||
    existsSync(join(packDir, 'zh-tw'))
  ) {
    return true;
  }
  return false;
};

export { checkSources };
