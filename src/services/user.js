import request from '@/utils/request';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request('http://lab.lli.fun/api/v1/user/currentUser');
}
