import Axios from 'axios'
import { getAuth } from '@/utils/auth';
const axios=Axios.create()
axios.interceptors.response.use(
    response => response,
    error => {
      if (error.response) {
        switch (error.response.status) {
          case 401:
            message.error('密码错误');
            setTimeout(() => {
              window.location.reload();
            }, 1000);
            break;
        }
      }
      return Promise.reject(error.response.data);
    }
  );
  axios.interceptors.request.use(
    config => {
        if (getAuth().token) {  // 每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token，不用每次请求都手动添加了
            config.headers.Authorization = getAuth().token;
        }
        return config;
    },
    err => {
        return Promise.reject(err);
    });