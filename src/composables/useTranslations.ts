import { FetchRecordArgs } from '@/interfaces';
import { Dispatch, useStore } from 'vuex';

const fetchRecords = (
  dispatch: Dispatch,
  args: FetchRecordArgs,
  locale?: string,
) => {
  dispatch('translations/fetchRecords', {
    locale,
    args,
  });
};

const useTranslations = () => {
  const { dispatch } = useStore();
  return {
    fetchRecords: (args: FetchRecordArgs, locale?: string) =>
      fetchRecords(dispatch, args, locale),
  };
};

export { useTranslations };
