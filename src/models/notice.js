import { addNotice, queryNotice as query } from '@/services/api';

export default {
  namespace: 'notice',

  state: {
    notices: [],
  },

  effects: {
    *addNotice({ payload }, { call, put }) {
      yield call(addNotice, payload);
      const response = yield call(query);
      yield put({
        type: 'getNotice',
        payload: response,
      });
    },
    *queryNotice({ payload }, { call, put }) {
      console.log(1);
      const response = yield call(query);
      yield put({
        type: 'getNotice',
        payload: response,
      });
    },
  },

  reducers: {
    getNotice(state, { payload }) {
      return {
        ...state,
        notices: [...payload],
      };
    },
  },
};
