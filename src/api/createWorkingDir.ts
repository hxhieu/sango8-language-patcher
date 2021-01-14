import { existsSync, mkdir } from 'fs';
import { promisify } from 'util';

import { workDir } from './const';

const mkdirAsync = promisify(mkdir);

const checkCreateWorkDir = async (): Promise<void> => {
  if (!existsSync(workDir)) {
    await mkdirAsync(workDir);
  }
};

export { checkCreateWorkDir };
