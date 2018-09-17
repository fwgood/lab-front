import { register as reg } from '@/services/api';

export default {
  namespace: 'register',

  state: {},

  effects: {
    *register({ payload }, { call }) {
      console.log(payload);
      yield call(reg, payload);
    },
  },

  reducers: {},
};
