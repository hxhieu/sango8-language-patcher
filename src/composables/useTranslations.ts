import { FetchRecordArgs, TranslationRecord } from '@/interfaces';
import { Dispatch, useStore } from 'vuex';

const fetchRecords = (dispatch: Dispatch, args: FetchRecordArgs) => {
  dispatch('translations/fetchRecords', args);
};

const saveRecords = (
  dispatch: Dispatch,
  records: TranslationRecord[],
  args: FetchRecordArgs,
) => {
  // Need to clear cache to load updated records
  args = {
    ...args,
    clearCache: true,
  };
  dispatch('translations/saveRecords', {
    records,
    args,
  });
};

const translateRecords = (
  dispatch: Dispatch,
  provider: string,
  records: TranslationRecord[],
  args: FetchRecordArgs,
) => {
  // Need to clear cache to load updated records
  args = {
    ...args,
    clearCache: true,
  };
  dispatch('translations/translateRecords', {
    provider,
    records,
    args,
  });
};

const useTranslations = () => {
  const { dispatch } = useStore();
  return {
    fetchRecords: (args: FetchRecordArgs) => fetchRecords(dispatch, args),
    saveRecords: (records: TranslationRecord[], args: FetchRecordArgs) =>
      saveRecords(dispatch, records, args),
    translateRecords: (
      provider: string,
      records: TranslationRecord[],
      args: FetchRecordArgs,
    ) => translateRecords(dispatch, provider, records, args),
  };
};

export { useTranslations };
