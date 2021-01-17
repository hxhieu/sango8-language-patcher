import { ipcMain, IpcMainInvokeEvent } from 'electron';

import {
  EVENT_CHECK_CREATE_WORKING_DIR,
  EVENT_CHECK_SOURCES,
  EVENT_FETCH_PACKS,
  EVENT_FETCH_RECORDS,
  DEBUG_PARSE_SOURCES,
  EVENT_LIST_LOCAL_PACKS,
  EVENT_SAVE_RECORDS,
} from './const';
import { checkCreateWorkDir } from './dirUtils';
import { parseSources } from './debug/parseSources';
import { log } from './logger';
import { checkSources } from './checkSources';
import { fetchPacks } from './fetchPacks';
import { fetchRecords } from './fetchRecords';
import { listPacks } from './localPackUtils';
import { FetchRecordArgs, TranslationRecord } from '@/interfaces';
import { saveRecords } from './saveRecords';

const handleInvocations = () => {
  // Debug events
  if (process.env.NODE_ENV !== 'production') {
    ipcMain.handle(DEBUG_PARSE_SOURCES, async (_, variant: string) => {
      try {
        await parseSources(variant);
      } catch (e) {
        log(e.message, 'error');
      }
    });
  }

  ipcMain.handle(EVENT_CHECK_SOURCES, (e: IpcMainInvokeEvent) => {
    try {
      const valid = checkSources();
      e.sender.send(EVENT_CHECK_SOURCES, valid);
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

  // Download packs from repo
  ipcMain.handle(
    EVENT_FETCH_PACKS,
    async (e: IpcMainInvokeEvent, locale: string) => {
      try {
        await fetchPacks(e.sender, locale);
        e.sender.send(EVENT_FETCH_PACKS, true);
      } catch (e) {
        log(e.message, 'error');
        e.sender.send(EVENT_FETCH_PACKS, false);
      }
    },
  );

  // Fetch local translations
  ipcMain.handle(
    EVENT_FETCH_RECORDS,
    async (e: IpcMainInvokeEvent, args: FetchRecordArgs) => {
      try {
        const [records, total] = await fetchRecords(args);
        e.sender.send(EVENT_FETCH_RECORDS, records, total);
      } catch (e) {
        log(e.message, 'error');
      }
    },
  );

  // List local translation folders
  ipcMain.handle(EVENT_LIST_LOCAL_PACKS, async (e: IpcMainInvokeEvent) => {
    try {
      const packs = await listPacks();
      e.sender.send(EVENT_LIST_LOCAL_PACKS, packs);
    } catch (e) {
      log(e.message, 'error');
    }
  });

  ipcMain.handle(
    EVENT_SAVE_RECORDS,
    async (
      e: IpcMainInvokeEvent,
      records: TranslationRecord[],
      args: FetchRecordArgs,
    ) => {
      try {
        await saveRecords(records, args);
        e.sender.send(EVENT_SAVE_RECORDS);
      } catch (e) {
        log(e.message, 'error');
      }
    },
  );
};

export { handleInvocations };
