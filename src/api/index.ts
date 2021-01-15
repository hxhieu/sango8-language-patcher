import { ipcMain, IpcMainInvokeEvent } from 'electron';

import {
  EVENT_CHECK_CREATE_WORKING_DIR,
  EVENT_CHECK_SOURCES,
  EVENT_FETCH_PACKS,
  EVENT_FETCH_RECORDS,
  DEBUG_PARSE_SOURCES,
} from './const';
import { checkCreateWorkDir } from './dirUtils';
import { parseSources } from './debug/parseSources';
import { log } from './logger';
import { checkSources } from './checkSources';
import { fetchPacks } from './fetchPacks';
import { fetchRecords } from './fetchRecords';

const handleInvocations = () => {
  // Debug events
  if (process.env.NODE_ENV !== 'production') {
    ipcMain.handle(DEBUG_PARSE_SOURCES, async (_, args) => {
      try {
        await parseSources(args[0]);
      } catch (e) {
        log(e.message, 'error');
      }
    });
  }

  ipcMain.handle(EVENT_CHECK_SOURCES, (e: IpcMainInvokeEvent) => {
    try {
      const valid = checkSources();
      e.sender.send(EVENT_CHECK_SOURCES, [valid]);
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

  ipcMain.handle(
    EVENT_FETCH_PACKS,
    async (e: IpcMainInvokeEvent, args: any[]) => {
      try {
        await fetchPacks(e.sender, args[0]);
        e.sender.send(EVENT_FETCH_PACKS, [true]);
      } catch (e) {
        log(e.message, 'error');
        e.sender.send(EVENT_FETCH_PACKS, [false]);
      }
    },
  );

  ipcMain.handle(
    EVENT_FETCH_RECORDS,
    async (e: IpcMainInvokeEvent, args: any[]) => {
      try {
        const records = await fetchRecords(
          args[0],
          args[1],
          args[2],
          args[3] && parseInt(args[3], 10),
          args[4] && parseInt(args[4], 10),
        );
        e.sender.send(EVENT_FETCH_RECORDS, [records]);
      } catch (e) {
        log(e.message, 'error');
      }
    },
  );
};

export { handleInvocations };
