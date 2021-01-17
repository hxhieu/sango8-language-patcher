import { homedir } from 'os';
import { join } from 'path';

export const workDir = join(homedir(), 'sango8-language-patcher');
export const packDir = join(workDir, 'packs');

// TODO: Configurable
export const packDownloadUrl =
  'https://github.com/hxhieu/sango8-language-packs/releases/latest/download';

export const packExt = 'lz';

// Read the raw file into folders
export const DEBUG_PARSE_SOURCES = 'DEBUG_PARSE_SOURCES';

export const EVENT_CHECK_CREATE_WORKING_DIR = 'EVENT_CHECK_CREATE_WORKING_DIR';
export const EVENT_LOGGER = 'EVENT_LOGGER';
export const EVENT_CHECK_SOURCES = 'EVENT_CHECK_SOURCES';
export const EVENT_FETCH_PACKS = 'EVENT_FETCH_PACKS';
export const EVENT_DOWNLOAD_PROGRESS = 'EVENT_DOWNLOAD_PROGRESS';
export const EVENT_UNZIP_PROGRESS = 'EVENT_UNZIP_PROGRESS';
export const EVENT_FETCH_LOCAL_RECORDS = 'EVENT_FETCH_LOCAL_RECORDS';
export const EVENT_FETCH_SOURCE_RECORDS = 'EVENT_FETCH_SOURCE_RECORDS';
export const EVENT_LIST_LOCAL_PACKS = 'EVENT_LIST_LOCAL_PACKS';
export const EVENT_SAVE_RECORDS = 'EVENT_SAVE_RECORDS';
