import { BrowserWindow } from 'electron';
import { EVENT_LOGGER } from './const';

const log = (message: string, type: 'info' | 'warn' | 'error' = 'info') => {
  if (type === 'info' || type === 'warn') {
    console.log(`${type.toLocaleUpperCase()}: ${message}`);
  } else {
    console.error(message);
  }
  const win = BrowserWindow.getFocusedWindow();
  if (win) {
    win.webContents.send(EVENT_LOGGER, { message, type });
  }
};

export { log };
