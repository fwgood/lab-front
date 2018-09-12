import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { login, getFakeCaptcha } from '@/services/api';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';
import { reloadAuth, setAuth, getAuth } from '@/utils/auth';

export default {
  namespace: 'login',

  state: {
    status: undefined,
    role: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(login, payload);

      // Login successfully
      if (response.code === 200) {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: true,
            role: response.role,
            token: response.token,
          },
        });
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.startsWith('/#')) {
              redirect = redirect.substr(2);
            }
          } else {
            window.location.href = redirect;
            return;
          }
        }
        console.log(response);
        yield put(routerRedux.replace(redirect || '/'));
      }
    },

    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },

    *logout(_, { put }) {
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
        },
      });
      yield put(
        routerRedux.push({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        })
      );
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      // setAuthority(payload.currentAuthority);
      if (payload.status == false) {
        localStorage.clear();
      } else if (payload.status == true) {
        setAuth({ role: payload.role, token: payload.token });
      }
      return {
        role: payload.role,
        status: payload.status,
      };
    },
  },
};
