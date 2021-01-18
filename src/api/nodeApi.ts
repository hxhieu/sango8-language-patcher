import { readdir, stat, readFile, writeFile } from 'fs';
import { promisify } from 'util';

const readdirAsync = promisify(readdir);
const statAsync = promisify(stat);
const readFileAsync = promisify(readFile);
const writeFileAsync = promisify(writeFile);

export { readdirAsync, statAsync, readFileAsync, writeFileAsync };
