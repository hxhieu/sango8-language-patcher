import { ipcMain, IpcMainInvokeEvent } from 'electron';

import {
  EVENT_CHECK_CREATE_WORKING_DIR,
  EVENT_CHECK_SOURCES,
  EVENT_FETCH_PACKS,
  EVENT_FETCH_RECORDS,
  DEBUG_PARSE_SOURCES,
  EVENT_LIST_LOCAL_PACKS,
  EVENT_SAVE_RECORDS,
  EVENT_TRANSLATE_RECORDS,
  EVENT_CREATE_PATCHES,
  EVENT_REVERT_RECORDS,
} from './const';
import { checkCreateWorkDir } from './dirUtils';
import { parseSources } from './debug/parseSources';
import { log } from './logger';
import { checkSources } from './checkSources';
import { fetchPacks } from './fetchPacks';
import { fetchRecords } from './fetchRecords';
import { listPacks } from './localPackUtils';
import {
  FetchRecordArgs,
  SourceVariant,
  TranslationRecord,
} from '@/interfaces';
import { saveRecords } from './saveRecords';
import { translateRecords } from './translateRecords';
import { createPatches } from './createPatches';
import { revertRecords } from './revertRecords';

const handleInvocations = () => {
  // Debug events
  if (process.env.NODE_ENV !== 'production') {
    ipcMain.handle(DEBUG_PARSE_SOURCES, async (_, variant: SourceVariant) => {
      try {
        await parseSources(variant);
      } catch (err) {
        log(err.message, 'error');
      }
    });
  }

  ipcMain.handle(EVENT_CHECK_SOURCES, (e: IpcMainInvokeEvent) => {
    try {
      const valid = checkSources();
      e.sender.send(EVENT_CHECK_SOURCES, valid);
    } catch (err) {
      log(err.message, 'error');
    }
  });

  ipcMain.handle(EVENT_CHECK_CREATE_WORKING_DIR, async () => {
    try {
      await checkCreateWorkDir();
    } catch (err) {
      log(err.message, 'error');
    }
  });

  // Download packs from repo
  ipcMain.handle(
    EVENT_FETCH_PACKS,
    async (e: IpcMainInvokeEvent, locale: string) => {
      try {
        await fetchPacks(e.sender, locale);
        e.sender.send(EVENT_FETCH_PACKS, true);
      } catch (err) {
        log(err.message, 'error');
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
      } catch (err) {
        log(err.message, 'error');
        e.sender.send(EVENT_FETCH_RECORDS, [], 0);
      }
    },
  );

  // List local translation folders
  ipcMain.handle(EVENT_LIST_LOCAL_PACKS, async (e: IpcMainInvokeEvent) => {
    try {
      const packs = await listPacks();
      e.sender.send(EVENT_LIST_LOCAL_PACKS, packs);
    } catch (err) {
      log(err.message, 'error');
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
      } catch (err) {
        log(err.message, 'error');
      } finally {
        e.sender.send(EVENT_SAVE_RECORDS);
      }
    },
  );

  ipcMain.handle(
    EVENT_TRANSLATE_RECORDS,
    async (
      e: IpcMainInvokeEvent,
      provider: string,
      records: TranslationRecord[],
      args: FetchRecordArgs,
    ) => {
      try {
        await translateRecords(e.sender, provider, records, args);
      } catch (err) {
        log(err.message, 'error');
      } finally {
        e.sender.send(EVENT_TRANSLATE_RECORDS);
      }
    },
  );

  ipcMain.handle(
    EVENT_CREATE_PATCHES,
    async (
      e: IpcMainInvokeEvent,
      locale: string,
      variant: SourceVariant,
      from?: number,
      count?: number,
    ) => {
      try {
        await createPatches(locale, variant, from, count);
      } catch (err) {
        log(err.message, 'error');
      } finally {
        e.sender.send(EVENT_CREATE_PATCHES);
      }
    },
  );

  ipcMain.handle(
    EVENT_REVERT_RECORDS,
    async (
      e: IpcMainInvokeEvent,
      records: TranslationRecord[],
      args: FetchRecordArgs,
    ) => {
      try {
        await revertRecords(records, args);
      } catch (err) {
        log(err.message, 'error');
      } finally {
        e.sender.send(EVENT_REVERT_RECORDS);
      }
    },
  );
};

export { handleInvocations };
