import { homedir } from 'os';
import { join } from 'path';

export const workDir = join(homedir(), 'sango8-language-patcher');
export const packDir = join(workDir, 'packs');

// TODO: Configurable
export const packDownloadUrl =
  'https://github.com/hxhieu/sango8-language-packs/releases/latest/download';

export const packExt = 'lz';

export const sourceFullHeader = [25683, 0, 0, ['id', 'text']];
export const sourcePartHeader = [72, 0, 0, ['id', 'text']];

// Read the raw file into folders
export const DEBUG_PARSE_SOURCES = 'DEBUG_PARSE_SOURCES';

export const EVENT_CHECK_CREATE_WORKING_DIR = 'EVENT_CHECK_CREATE_WORKING_DIR';
export const EVENT_LOGGER = 'EVENT_LOGGER';
export const EVENT_CHECK_SOURCES = 'EVENT_CHECK_SOURCES';
export const EVENT_FETCH_PACKS = 'EVENT_FETCH_PACKS';
export const EVENT_DOWNLOAD_PROGRESS = 'EVENT_DOWNLOAD_PROGRESS';
export const EVENT_FETCH_RECORDS = 'EVENT_FETCH_RECORDS';
export const EVENT_LIST_LOCAL_PACKS = 'EVENT_LIST_LOCAL_PACKS';
export const EVENT_SAVE_RECORDS = 'EVENT_SAVE_RECORDS';
export const EVENT_TRANSLATE_RECORDS = 'EVENT_TRANSLATE_RECORDS';
export const EVENT_TRANSLATE_RECORDS_BATCH = 'EVENT_TRANSLATE_RECORDS_BATCH';
export const EVENT_CREATE_PATCHES = 'EVENT_CREATE_PATCHES';
export const EVENT_REVERT_RECORDS = 'EVENT_REVERT_RECORDS';
export const EVENT_BLOCK_UI = 'EVENT_BLOCK_UI';
export const EVENT_UNBLOCK_UI = 'EVENT_UNBLOCK_UI';
