import { routerRedux } from 'dva/router';
import { message } from 'antd';
import {
  addBlog as add,
  queryBlog as query,
  queryMyBlog as queryMy,
  addComment as addC,
  getComment as getC,
} from '@/services/api';

export default {
  namespace: 'blog',

  state: {
    blogs: [],
    comments: [],
    activeBlog: '',
  },

  effects: {
    *queryBlog({ payload }, { call, put }) {
      const response = yield call(query, payload);
      yield put({
        type: 'fetchBlog',
        payload: response,
      });
    },
    *queryMyBlog({ payload }, { call, put }) {
      const response = yield call(queryMy, payload);
      yield put({
        type: 'fetchBlog',
        payload: response,
      });
    },
    *addBlog({ payload }, { call, put }) {
      console.log(payload);
      yield call(add, payload);
      const response = yield call(query, payload);
      yield put({
        type: 'fetchBlog',
        payload: response,
      });
    },
    *addComment({ payload }, { call, put }) {
      yield call(addC, payload);
      const response = yield call(getC, {
        parentId: payload.blogsreviewParentid,
      });
      yield put({
        type: 'fetchComment',
        payload: response,
      });
    },
    *getComment({ payload }, { call, put }) {
      const response = yield call(getC, payload);
      yield put({
        type: 'fetchComment',
        payload: response,
      });
    },
  },

  reducers: {
    fetchBlog(state, { payload }) {
      return {
        ...state,
        blogs: payload,
      };
    },
    fetchComment(state, { payload }) {
      return {
        ...state,
        comments: payload,
      };
    },
  },
};
