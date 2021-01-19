import { FetchRecordArgs, TranslationRecord } from '@/interfaces';
import { fetchRecords } from './fetchRecords';
import { TranslationService } from './translationServices';
import { writeTranslation } from './writeTranslation';
import { WebContents } from 'electron';
import { EVENT_TRANSLATE_RECORDS_BATCH } from './const';

interface TranslationBatch {
  [key: number]: string | undefined;
}

const translateRecords = async (
  sender: WebContents,
  provider: string,
  records: TranslationRecord[],
  args: FetchRecordArgs,
) => {
  const { local, fileType } = args;
  if (!local) {
    return;
  }
  const { translate, maxRequestCharacters } = (await import(
    `./translationServices/${provider}`
  )) as TranslationService;

  const to = local.split('.')[0];
  const lineDelimiter = '\n';

  // Translate all
  if (records.length === 0) {
    [records] = await fetchRecords({
      ...args,
      pageIndex: 0,
      pageSize: Number.MAX_SAFE_INTEGER,
    });
  }

  const allRaw = records.map(x => `${x.id}:${x.original}`).join('\n');
  const totalBatches = Math.ceil(allRaw.length / maxRequestCharacters);

  //Loop and translate batch
  let currentRecord = 0;
  let currentBatch = 0;
  while (currentRecord < records.length) {
    let currentBatchRaw = '';
    while (
      currentBatchRaw.length <= maxRequestCharacters &&
      currentRecord < records.length
    ) {
      const { id, original } = records[currentRecord];
      currentBatchRaw += `${id}:${original}${lineDelimiter}`;
      currentRecord++;
    }

    // Next batch
    currentBatch++;
    const translated = await translate(currentBatchRaw, to);
    const currentBatchRecords: TranslationRecord[] = [];

    translated.split(lineDelimiter).forEach(line => {
      const frags = line.split(':');
      const id = frags[0];
      // Remove the 1st elem = the id
      frags.shift();
      // Join the rest
      const text = frags.join(': ');
      const record = records.find(x => x.id === parseInt(id, 10));
      if (record) {
        currentBatchRecords.push({
          ...record,
          text: text.trim(),
        });
      }
    });

    await writeTranslation(local, currentBatchRecords, fileType === 'part');
    sender.send(EVENT_TRANSLATE_RECORDS_BATCH, currentBatch, totalBatches);
  }
};

export { translateRecords };
