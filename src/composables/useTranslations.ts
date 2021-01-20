import { FetchRecordArgs, TranslationRecord } from '@/interfaces';
import { Dispatch, useStore } from 'vuex';

const fetchRecords = (dispatch: Dispatch, args: FetchRecordArgs) => {
  dispatch('translations/fetchRecords', args);
};

const saveRecords = (
  dispatch: Dispatch,
  records: TranslationRecord[],
  args: FetchRecordArgs,
  memSave: boolean,
) => {
  // Need to clear cache to load updated records
  args = {
    ...args,
    clearCache: !memSave,
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

const revertRecords = (
  dispatch: Dispatch,
  records: TranslationRecord[],
  args: FetchRecordArgs,
) => {
  // Need to clear cache to load updated records
  args = {
    ...args,
    clearCache: true,
  };
  dispatch('translations/revertRecords', {
    records,
    args,
  });
};

const useTranslations = () => {
  const { dispatch } = useStore();
  return {
    fetchRecords: (args: FetchRecordArgs) => fetchRecords(dispatch, args),
    saveRecords: (
      records: TranslationRecord[],
      args: FetchRecordArgs,
      memSave: boolean,
    ) => saveRecords(dispatch, records, args, memSave),
    translateRecords: (
      provider: string,
      records: TranslationRecord[],
      args: FetchRecordArgs,
    ) => translateRecords(dispatch, provider, records, args),
    revertRecords: (records: TranslationRecord[], args: FetchRecordArgs) =>
      revertRecords(dispatch, records, args),
  };
};

export { useTranslations };
