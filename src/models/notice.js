import { addNotice, queryNotice as query ,getAllComment as getComment,read as r} from '@/services/api';
import { read } from 'fs';

export default {
  namespace: 'notice',

  state: {
    notices: [],
    comments:[],
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
    *getAllComment({payload},{call,put}){
      const response=yield call(getComment)
      yield put({
        type:'getComment',
        payload:response
      })
    },
    *read({payload},{call,put}){

      yield call(r,payload)
      const response=yield call(getComment)

      yield put({
        type:'getComment',
        payload:response
      })
    }
  },

  reducers: {
    getNotice(state, { payload }) {
      return {
        ...state,
        notices: [...payload],
      };
    },
    getComment(state,{payload}){
      return {
        ...state,
        comments:[...payload]
      }
    }
  },
};
