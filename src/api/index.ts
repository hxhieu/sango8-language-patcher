import { ipcMain, IpcMainInvokeEvent } from 'electron';

import {
  EVENT_CHECK_CREATE_WORKING_DIR,
  EVENT_CHECK_SOURCES,
  EVENT_FETCH_PACKS,
  EVENT_FETCH_RECORDS,
  DEBUG_PARSE_SOURCES,
  EVENT_LIST_LOCAL_PACKS,
} from './const';
import { checkCreateWorkDir } from './dirUtils';
import { parseSources } from './debug/parseSources';
import { log } from './logger';
import { checkSources } from './checkSources';
import { fetchPacks } from './fetchPacks';
import { fetchRecords } from './fetchRecords';
import { listPacks } from './localPackUtils';

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
        console.log(args);
        const records = await fetchRecords(args[0], {
          fileType: args[1],
          search: args[2],
          pageIndex: args[3],
          pageSize: args[4],
          exact: args[5],
        });
        e.sender.send(EVENT_FETCH_RECORDS, [records]);
      } catch (e) {
        log(e.message, 'error');
      }
    },
  );

  ipcMain.handle(EVENT_LIST_LOCAL_PACKS, async (e: IpcMainInvokeEvent) => {
    try {
      const packs = await listPacks();
      e.sender.send(EVENT_LIST_LOCAL_PACKS, [packs]);
    } catch (e) {
      log(e.message, 'error');
    }
  });
};

export { handleInvocations };
