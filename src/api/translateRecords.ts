import { FetchRecordArgs, TranslationRecord } from '@/interfaces';
import { fetchRecords } from './fetchRecords';
import { log } from './logger';
import { TranslationService } from './translationServices';
import { writeTranslation } from './writeTranslation';

interface TranslationBatch {
  [key: number]: string | undefined;
}

const translateRecords = async (
  provider: string,
  records: TranslationRecord[],
  args: FetchRecordArgs,
) => {
  const { local, fileType } = args;
  if (!local) {
    return;
  }

  const to = local.split('.')[0];

  // Translate all
  if (records.length === 0) {
    [records] = await fetchRecords({
      ...args,
      pageIndex: 0,
      pageSize: Number.MAX_SAFE_INTEGER,
    });
  }

  const { translate, maxRequestCharacters } = (await import(
    `./translationServices/${provider}`
  )) as TranslationService;

  //Loop and translate batch
  let currentRecord = 0;
  let batchCount = 0;
  let batch: TranslationBatch = {};
  while (currentRecord < records.length) {
    while (
      [...JSON.stringify(batch)].length <= maxRequestCharacters &&
      currentRecord < records.length
    ) {
      const { id, original } = records[currentRecord];
      batch[id] = original;
      currentRecord++;
    }

    // Each batch
    batchCount++;
    const json = JSON.stringify(batch);
    const translated = await translate(json, to);
    console.log('TRANSLATED: ', translated);

    const result = JSON.parse(
      // Need to escape for JSON here
      translated.replace(/"/g, "'").trim(),
    ) as TranslationBatch;

    // Update the source
    for (const record of records) {
      record.text = result[record.id];
    }

    await writeTranslation(local, records, fileType === 'part');
    log(`Batch #${batchCount} translated`, 'success');

    // Reset the batch
    batch = {};
  }
};

export { translateRecords };
