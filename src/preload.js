import { ipcRenderer } from 'electron';
import { homedir } from 'os';
import { join } from 'path';

const workDir = join(homedir(), 'sango8-language-patcher');

// MUST comfort ElectronApi interface
window._api = {
  workDir,
  ipcRenderer,
};
