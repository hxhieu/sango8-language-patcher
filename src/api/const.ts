import { homedir } from 'os';
import { join } from 'path';

const workDir = join(homedir(), 'sango8-language-patcher');

const EVENT_PARSE_SOURCES = 'EVENT_PARSE_SOURCES';
const EVENT_CHECK_CREATE_WORKING_DIR = 'EVENT_CHECK_CREATE_WORKING_DIR';
const EVENT_LOGGER = 'EVENT_LOGGER';

export {
  workDir,
  EVENT_PARSE_SOURCES,
  EVENT_CHECK_CREATE_WORKING_DIR,
  EVENT_LOGGER,
};
