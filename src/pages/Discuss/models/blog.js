import { routerRedux } from 'dva/router';
import { message } from 'antd';
import {
  addBlog as add,
  queryBlog as query,
  queryMyBlog as queryMy,
  addComment as addC,
  getComment as getC,
  searchBlog,
  modifyStar,
} from '@/services/api';

export default {
  namespace: 'blog',

  state: {
    blogs: [],
    comments: [],
    activeBlog: '',
  },

  effects: {
    isPress: false,
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
      yield call(add,payload)
      console.log(payload);
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
    *search({ payload }, { call, put }) {
      const response = yield call(searchBlog, payload);
      yield put({
        type: 'fetchBlog',
        payload: response,
      });
    },
    *star({ payload }, { call, put }) {
        yield call(modifyStar, payload);

        yield put({
          type: 'changeStar',
          payload,
        });
      }
  },

  reducers: {
    fetchBlog(state, { payload }) {
      return {
        ...state,
        blogs: payload.list,
      };
    },
    fetchComment(state, { payload }) {
      return {
        ...state,
        comments: payload,
      };
    },
    changeStar(state, { payload }) {
      const old = { ...state };
      const index = old.blogs.findIndex(e => e.blogId == payload.blogId);
      old.blogs[index].blogCount++;
      return old;
    },
  },
};
