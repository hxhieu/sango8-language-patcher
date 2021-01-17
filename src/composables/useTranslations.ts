import { FetchRecordArgs, TranslationRecord } from '@/interfaces';
import { Dispatch, useStore } from 'vuex';

const fetchRecords = (
  dispatch: Dispatch,
  args: FetchRecordArgs,
  fetchSource: boolean,
) => {
  dispatch('translations/fetchRecords', {
    args,
    fetchSource,
  });
};

const saveRecords = (
  dispatch: Dispatch,
  ids: number[],
  detail: TranslationRecord,
  args: FetchRecordArgs,
) => {
  dispatch('translations/saveRecords', {
    ids,
    detail,
    args,
  });
};

const useTranslations = () => {
  const { dispatch } = useStore();
  return {
    fetchRecords: (args: FetchRecordArgs, fetchSource = false) =>
      fetchRecords(dispatch, args, fetchSource),
    saveRecords: (
      ids: number[],
      detail: TranslationRecord,
      args: FetchRecordArgs,
    ) => saveRecords(dispatch, ids, detail, args),
  };
};

export { useTranslations };
