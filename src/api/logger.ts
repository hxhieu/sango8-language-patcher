import { BrowserWindow } from 'electron';
import { EVENT_LOGGER } from './const';
import { LogMessage, LogType } from '@/interfaces/logMessage';

const log = (message: string, type: LogType = 'info') => {
  if (type === 'error') {
    console.error(message);
  } else {
    console.log(`${type.toLocaleUpperCase()}: ${message}`);
  }
  const win = BrowserWindow.getFocusedWindow();
  if (win) {
    win.webContents.send(EVENT_LOGGER, { message, type } as LogMessage);
  }
};

export { log };
