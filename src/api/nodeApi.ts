import { readdir, stat, existsSync, mkdir } from 'fs';
import { readFile, writeFile, unlink } from 'graceful-fs';
import { promisify } from 'util';

const readdirAsync = promisify(readdir);
const statAsync = promisify(stat);
const readFileAsync = promisify(readFile);
const writeFileAsync = promisify(writeFile);
const mkdirAsync = promisify(mkdir);
const unlinkAsync = promisify(unlink);

export {
  readdirAsync,
  statAsync,
  readFileAsync,
  writeFileAsync,
  existsSync,
  mkdirAsync,
  unlinkAsync,
};
