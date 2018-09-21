import { routerRedux } from 'dva/router';
import {} from 'dva';
import {
  queryAllCourse,
  addCourse as add,
  queryMyCourse,
  changeCourseState as changeCS,
  delCourse,
  searchCourse as search,
  select,
  quit,
} from '@/services/api';

export default {
  namespace: 'course',
  state: {
    list: [],
    course: [],
  },

  effects: {
    *addCourse({ payload }, { call, put }) {
      yield call(add, payload);
      yield put(
        routerRedux.push('/result/success', {
          title: '提交成功',
          description: '申请开课成功，等待管理员审核',
          course_name: payload.course_name,
          term: payload.term,
        })
      );
    },
    *fetchAllCourse({ payload }, { call, put }) {
      const response = yield call(queryAllCourse);
      yield put({
        type: 'queryAll',
        payload: response,
      });
    },
    *fetchMyCourse({ payload }, { call, put }) {
      const response = yield call(queryMyCourse,payload);
      yield put({
        type: 'queryAll',
        payload: response.list,
      });
    },
    *changeCourseState({ payload }, { call, put }) {
      yield call(changeCS, payload);
      const response = yield call(queryAllCourse);
      yield put({
        type: 'queryAll',
        payload: response,
      });
      yield put({
        type: 'queryAll',
        payload: response,
      });
    },
    *deleteCourse({ payload }, { call, put }) {
      yield call(delCourse, payload);
      const response = yield call(queryAllCourse);
      yield put({
        type: 'queryAll',
        payload: response,
      });
    },
    *searchCourse({ payload }, { call, put }) {
      const response = yield call(search);
      yield call(() => {
        console.log(response);
      });
      yield put({
        type: 'search',
        payload: response.list,
      });
    },
    *selectCourse({ payload }, { call, put }) {
      yield call(select, payload);
      const response = yield call(queryMyCourse);
      yield put({
        type: 'queryAll',
        payload: response.list,
      });
    },
    *quitCourse({ payload }, { call, put }) {
      yield call(quit, payload);
      const response = yield call(queryMyCourse);
      yield put({
        type: 'queryAll',
        payload: response.list,
      });
    },
  },

  reducers: {
    queryAll(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    search(state, action) {
      return {
        ...state,
        course: action.payload,
      };
    },
  },
};
