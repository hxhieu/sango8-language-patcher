import { existsSync, mkdirSync } from 'fs';
import { workDir } from '.';

const checkCreateWorkDir = () => {
  if (!existsSync(workDir)) {
    mkdirSync(workDir);
  }
};

export { checkCreateWorkDir };
