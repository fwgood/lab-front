import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { addCourse as add } from '@/services/api';

export default {
  namespace: 'course',
  state: {},

  effects: {
    *addCourse({ payload }, { call, put }) {
      yield call(add, payload);
      yield put(routerRedux.push('/result/success', {
        title:'提交成功',
        description:'申请开课成功，等待管理员审核',
        course_name:payload.course_name,
        term:payload.term
      }));
    },
  },

  reducers: {},
};
