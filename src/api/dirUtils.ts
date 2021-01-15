import { existsSync, mkdir } from 'fs';
import { promisify } from 'util';

import { workDir, packDir } from './const';

// TODO: Make helper for these
const mkdirAsync = promisify(mkdir);

const checkCreateWorkDir = async (): Promise<void> => {
  if (!existsSync(workDir)) {
    await mkdirAsync(workDir);
  }
};

const checkCreatePackDir = async (): Promise<void> => {
  if (!existsSync(packDir)) {
    await mkdirAsync(packDir, { recursive: true });
  }
};

export { checkCreateWorkDir, checkCreatePackDir };
