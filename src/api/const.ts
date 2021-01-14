import { homedir } from 'os';
import { join } from 'path';

const workDir = join(homedir(), 'sango8-language-patcher');
const packDir = join(workDir, 'packs');
const packZip = join(packDir, 'packs.zip');

// TODO: Configurable
const packDownloadUrl =
  'https://github.com/hxhieu/sango8-language-packs/releases/latest/download/packs.zip';

const EVENT_PARSE_SOURCES = 'EVENT_PARSE_SOURCES';
const EVENT_CHECK_CREATE_WORKING_DIR = 'EVENT_CHECK_CREATE_WORKING_DIR';
const EVENT_LOGGER = 'EVENT_LOGGER';
const EVENT_CHECK_SOURCES = 'EVENT_CHECK_SOURCES';
const EVENT_FETCH_PACKS = 'EVENT_FETCH_PACKS';
const EVENT_DOWNLOAD_PROGRESS = 'EVENT_DOWNLOAD_PROGRESS';
const EVENT_UNZIP_PROGRESS = 'EVENT_UNZIP_PROGRESS';

export {
  workDir,
  packDir,
  packZip,
  packDownloadUrl,
  EVENT_PARSE_SOURCES,
  EVENT_CHECK_CREATE_WORKING_DIR,
  EVENT_LOGGER,
  EVENT_CHECK_SOURCES,
  EVENT_FETCH_PACKS,
  EVENT_DOWNLOAD_PROGRESS,
  EVENT_UNZIP_PROGRESS,
};
