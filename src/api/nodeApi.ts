import { readdir, stat } from 'fs';
import { promisify } from 'util';

const readdirAsync = promisify(readdir);
const statAsync = promisify(stat);

export { readdirAsync, statAsync };
