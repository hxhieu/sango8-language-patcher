import { Dispatch, useStore } from 'vuex';

const fetchLocalPacks = (dispatch: Dispatch) => {
  dispatch(`home/fetchLocalPacks`);
};

const useHome = () => {
  const { dispatch } = useStore();
  return {
    fetchLocalPacks: () => fetchLocalPacks(dispatch),
  };
};

export { useHome };
