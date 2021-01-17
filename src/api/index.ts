import { ipcMain, IpcMainInvokeEvent } from 'electron';

import {
  EVENT_CHECK_CREATE_WORKING_DIR,
  EVENT_CHECK_SOURCES,
  EVENT_FETCH_PACKS,
  EVENT_FETCH_LOCAL_RECORDS,
  DEBUG_PARSE_SOURCES,
  EVENT_LIST_LOCAL_PACKS,
  EVENT_FETCH_SOURCE_RECORDS,
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

  const handleFetchRecords = async (
    e: IpcMainInvokeEvent,
    args: any[],
    channel: string,
  ) => {
    const locale = args[0];
    const fileType = args[1];
    const search = args[2];
    const pageIndex = args[3];
    const pageSize = args[4];
    const exact = args[5];
    try {
      const result = await fetchRecords(locale, {
        fileType,
        search,
        pageIndex,
        pageSize,
        exact,
      });
      e.sender.send(channel, result);
    } catch (e) {
      log(e.message, 'error');
    }
  };

  ipcMain.handle(
    EVENT_FETCH_LOCAL_RECORDS,
    (e: IpcMainInvokeEvent, args: any[]) =>
      handleFetchRecords(e, args, EVENT_FETCH_LOCAL_RECORDS),
  );

  ipcMain.handle(
    EVENT_FETCH_SOURCE_RECORDS,
    (e: IpcMainInvokeEvent, args: any[]) =>
      handleFetchRecords(e, args, EVENT_FETCH_SOURCE_RECORDS),
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
