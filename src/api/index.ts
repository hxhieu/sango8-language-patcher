import { homedir } from 'os';
import { join } from 'path';

const workDir = join(homedir(), 'sango8-language-patcher');

export { workDir };

export * from './createWorkingDir';
