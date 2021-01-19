import { workDir, packDir } from './const';
import { existsSync, mkdirAsync } from './nodeApi';

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
