import { FetchRecordArgs, TranslationRecord } from '@/interfaces';
import { writeTranslation } from './writeTranslation';

const saveRecords = async (
  records: TranslationRecord[],
  args: FetchRecordArgs,
) => {
  const { local, fileType } = args;
  return writeTranslation(local as string, records, fileType === 'part');
};

export { saveRecords };
