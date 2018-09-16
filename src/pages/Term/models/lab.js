import { addLab as add, queryLab } from '@/services/api';

export default {
  namespace: 'lab',

  state: {
    labs: [],
  },

  effects: {
    *addLab({ payload }, { call, put }) {
      yield call(add, payload);
      const response = yield call(queryLab, payload);
      yield put({
        type: 'fetchLab',
        payload: response,
      });
    },
    *queryAll({ payload }, { call, put }) {
      const response = yield call(queryLab, payload);
      yield put({
        type: 'fetchLab',
        payload: response,
      });
    },
  },

  reducers: {
    fetchLab(state, action) {
      return {
        ...state,
        labs: action.payload,
      };
    },
  },
};
