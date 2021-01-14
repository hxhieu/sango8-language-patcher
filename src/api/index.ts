import { ipcMain } from 'electron';

import { EVENT_CHECK_CREATE_WORKING_DIR, EVENT_PARSE_SOURCES } from './const';
import { checkCreateWorkDir } from './createWorkingDir';
import { parseSources } from './parseSources';
import { log } from './logger';

const handleInvocations = () => {
  ipcMain.handle(EVENT_PARSE_SOURCES, async (_, args) => {
    try {
      await parseSources(args[0]);
    } catch (e) {
      log(e.message, 'error');
    }
  });
  ipcMain.handle(EVENT_CHECK_CREATE_WORKING_DIR, async () => {
    try {
      await checkCreateWorkDir();
    } catch (e) {
      log(e.message, 'error');
    }
  });
};

export { handleInvocations };
