import { join } from 'path';
import { FetchRecordArgs, TranslationRecord } from '@/interfaces';
import { fetchRecords } from './fetchRecords';
import { packDir } from './const';
import { unlinkAsync } from './nodeApi';
import { existsSync } from 'graceful-fs';

const revertRecords = async (
  records: TranslationRecord[],
  args: FetchRecordArgs,
) => {
  const { local, fileType } = args;
  if (!local) {
    return;
  }

  // Revert all i.e. delete all
  if (records.length === 0) {
    [records] = await fetchRecords({
      ...args,
      pageIndex: 0,
      pageSize: Number.MAX_SAFE_INTEGER,
    });
  }

  const calls: any = [];
  let dir = join(packDir, local, fileType || 'full');
  // Just delete the file...
  records.forEach(x => {
    const filePath = join(dir, `${x.id}.json`);
    if (existsSync(filePath)) {
      calls.push(unlinkAsync(filePath));
    }
  });
  await Promise.all(calls);
};

export { revertRecords };
