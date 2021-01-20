import { FetchRecordArgs, TranslationRecord } from '@/interfaces';
import { writeTranslation } from './writeTranslation';
import { clearPending, getRecords, set } from './translationCache';

const saveRecords = async (
  args: FetchRecordArgs,
  records?: TranslationRecord[],
) => {
  const { local, fileType, clearCache } = args;
  const localValue = local as string;
  const fileTypeValue = fileType as string;
  if (!clearCache && records) {
    return set(localValue, fileTypeValue, records);
  }
  // Write to the files = write the cache records
  records = getRecords(localValue, fileTypeValue);
  await writeTranslation(local as string, records, fileType === 'part');
  clearPending();
};

export { saveRecords };
