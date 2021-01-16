import { readdir } from 'fs';
import { promisify } from 'util';

const readdirAsync = promisify(readdir);

export { readdirAsync };
