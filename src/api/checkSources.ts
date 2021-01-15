import { join } from 'path';
import { existsSync } from 'fs';

import { packExt, workDir } from './const';

const checkSources = (): boolean => {
  if (
    existsSync(join(workDir, `zh-cn.${packExt}`)) ||
    existsSync(join(workDir, `zh-tw.${packExt}`))
  ) {
    return true;
  }
  return false;
};

export { checkSources };
