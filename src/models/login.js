import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { login, getFakeCaptcha, register as reg } from '@/services/api';
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
      const re = yield call(login, payload);
      const response = re.data;
      console.log(123);
      reloadAuthorized();
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
        if (redirect && redirect.match(/login/)) {
          yield put(routerRedux.replace('/'));
          return;
        }
        window.location.reload();
        if (redirect) {
          // const redirectUrlParams = new URL(redirect);
          // if (redirectUrlParams.origin === urlParams.origin) {
          //   redirect = redirect.substr(urlParams.origin.length);
          //   if (redirect.startsWith('/#')) {
          //     redirect = redirect.substr(2);
          //   }
          // } else {
          //   window.location.href = redirect;
          //   return;
          // }
          yield put(routerRedux.replace('/'));
return
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
      reloadAuthorized();
      yield put(
        routerRedux.push({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        })
      );
    },
    *register({ payload }, { call }) {
      yield call(reg, payload);
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      // setAuthority(payload.currentAuthority);
      if (payload.status == false) {
        localStorage.clear();
      } else if (payload.status == true) {
        setAuth({ role: payload.role, token: payload.token });
        setAuthority(payload.role);
      }
      return {
        role: payload.role,
        status: payload.status,
      };
    },
  },
};
