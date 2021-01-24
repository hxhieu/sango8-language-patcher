import { BrowserWindow } from 'electron';
import { EVENT_BLOCK_UI, EVENT_UNBLOCK_UI } from './const';

const blockUi = (message: string) => {
  const win = BrowserWindow.getFocusedWindow();
  if (win) {
    win.webContents.send(EVENT_BLOCK_UI, message);
  }
};

const unblockUi = () => {
  const win = BrowserWindow.getFocusedWindow();
  if (win) {
    win.webContents.send(EVENT_UNBLOCK_UI);
  }
};

export { blockUi, unblockUi };
