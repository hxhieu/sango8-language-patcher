import { Dispatch, useStore } from 'vuex';

const fetchRecords = (dispatch: Dispatch, locale: string, source: string) => {
  dispatch('translations/fetchRecords', {
    locale,
    source,
  });
};

const useTranslations = () => {
  const { dispatch } = useStore();
  return {
    fetchRecords: (locale: string, source: string) =>
      fetchRecords(dispatch, locale, source),
  };
};

export { useTranslations };
