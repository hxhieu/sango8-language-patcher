import { ipcMain, IpcMainInvokeEvent } from 'electron';

import {
  EVENT_CHECK_CREATE_WORKING_DIR,
  EVENT_CHECK_SOURCES,
  EVENT_FETCH_PACKS,
  EVENT_PARSE_SOURCES,
} from './const';
import { checkCreateWorkDir } from './dirUtils';
import { parseSources } from './parseSources';
import { log } from './logger';
import { checkSources } from './checkSources';
import { fetchPacks } from './fetchPacks';
import { extractPacks } from './extractPacks';

const handleInvocations = () => {
  ipcMain.handle(EVENT_CHECK_SOURCES, (e: IpcMainInvokeEvent) => {
    try {
      const valid = checkSources();
      e.sender.send(EVENT_CHECK_SOURCES, [valid]);
    } catch (e) {
      log(e.message, 'error');
    }
  });

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

  ipcMain.handle(EVENT_FETCH_PACKS, async (e: IpcMainInvokeEvent) => {
    try {
      await fetchPacks(e.sender);
      await extractPacks(e.sender);
      e.sender.send(EVENT_FETCH_PACKS, [true]);
    } catch (e) {
      log(e.message, 'error');
      e.sender.send(EVENT_FETCH_PACKS, [false]);
    }
  });
};

export { handleInvocations };
