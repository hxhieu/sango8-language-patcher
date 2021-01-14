import { ipcMain } from 'electron';

import { EVENT_CHECK_CREATE_WORKING_DIR, EVENT_PARSE_SOURCES } from './const';
import { checkCreateWorkDir } from './createWorkingDir';
import { parseSources } from './parseSources';

const handleInvocations = () => {
  ipcMain.handle(EVENT_PARSE_SOURCES, async (_, args) => {
    await parseSources(args[0]);
  });
  ipcMain.handle(EVENT_CHECK_CREATE_WORKING_DIR, async () => {
    await checkCreateWorkDir();
  });
};

export { handleInvocations };
