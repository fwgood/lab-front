import { queryUsers as query, delUser as del, modifyUser as modify } from '@/services/api';

export default {
  namespace: 'userlist',

  state: {
    users: [],
  },

  effects: {
    *queryList({ payload }, { call, put }) {
      const response = yield call(query, payload);
      yield put({
        type: 'fetchUserList',
        payload: response.list,
      });
    },
    *delUser({ payload }, { call, put }) {
      yield call(del, payload);
      const response = yield call(query, payload);
      yield put({
        type: 'fetchUserList',
        payload: response.list,
      });
    },
    *modifyUser({ payload }, { call, put }) {
      yield call(modify, payload);
      const response = yield call(query, payload);
      yield put({
        type: 'fetchUserList',
        payload: response.list,
      });
    },
  },

  reducers: {
    fetchUserList(state, action) {
      return {
        ...state,
        users: action.payload,
      };
    },
  },
};
