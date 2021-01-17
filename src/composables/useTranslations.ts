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
  dispatch('translations/saveRecords', {
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
  };
};

export { useTranslations };
