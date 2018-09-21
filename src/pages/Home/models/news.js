import { routerRedux } from 'dva/router';
import { getNews ,addNews as add} from '@/services/api';

export default {
  namespace: 'news',
  state: {
    news:[]
  },

  effects: {
    *queryNews({ payload }, { call, put }) {
     const response= yield call(getNews, payload);
      yield put(
        {
            type:'gNews',
            payload:response.list
        }
      );
    },
    *addNews({payload},{call,put}){
        yield call(add,payload)
        const response= yield call(getNews,{
          page:1,
          pageSize:20,
          sort:'desc'
        });
        yield put(
          {
              type:'gNews',
              payload:response.list
          }
        );
    }

  },

  reducers: {
    gNews(state, action) {
      return {
        ...state,
        news: action.payload,
      };
    },
  
  },
};
