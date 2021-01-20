import { FetchRecordArgs, TranslationRecord } from '@/interfaces';
import { writeTranslation } from './writeTranslation';
import { set } from './translationCache';

const saveRecords = async (
  records: TranslationRecord[],
  args: FetchRecordArgs,
) => {
  const { local, fileType, clearCache } = args;
  if (clearCache) {
    return writeTranslation(local as string, records, fileType === 'part');
  }
  return set(local as string, fileType as string, records);
};

export { saveRecords };
