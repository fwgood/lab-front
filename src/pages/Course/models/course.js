import { routerRedux } from 'dva/router';
import {} from 'dva';
import {
  queryAllCourse,
  addCourse as add,
  changeCourseState as changeCS,
  delCourse,
} from '@/services/api';

export default {
  namespace: 'course',
  state: {
    list: [],
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
  },

  reducers: {
    queryAll(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
  },
};
