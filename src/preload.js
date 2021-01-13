import { remote } from 'electron';
import { homedir } from 'os';
import { join } from 'path';

const { exit } = remote.app;
const workDir = join(homedir(), 'sango8-language-patcher');

// To comfort ElectronApi interface
window._api = {
  exit,
  workDir,
};
