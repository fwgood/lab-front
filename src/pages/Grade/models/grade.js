import { queryScore as query, addScore as add } from '@/services/api';

export default {
  namespace: 'grade',

  state: {
    scores: [],
  },

  effects: {
    *queryAllScore({ payload }, { call, put }) {
      const response = yield call(query, payload);
      yield put({
        type: 'fetchScore',
        payload: response,
      });
    },
    *addScore({ payload }, { call, put }) {
      yield call(add, payload);
      const response = yield call(query, payload);
      yield put({
        type: 'fetchScore',
        payload: response,
      });
    },
  },

  reducers: {
    fetchScore(state, action) {
      return {
        ...state,
        scores: action.payload,
      };
    },
  },
};
