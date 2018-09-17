import { stringify } from 'qs';
import request from '@/utils/request';
import Axios from 'axios';

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'update',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile() {
  return request('/api/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function removeFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'delete',
    },
  });
}

export async function addFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'post',
    },
  });
}

export async function updateFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'update',
    },
  });
}
export async function login(params) {
  return request('http://lab.lli.fun/api/v1/user/login', {
    method: 'POST',
    body: params,
  });
}
export async function fakeAccountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    body: params,
  });
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}

export async function getFakeCaptcha(mobile) {
  return request(`/api/captcha?mobile=${mobile}`);
}
// Course api

export async function addCourse(params) {
  return request('http://lab.lli.fun/api/v1/course/addCourse', {
    method: 'POST',
    body: params,
  });
}
export async function queryAllCourse() {
  return request('http://lab.lli.fun/api/v1/course/allCourseList', {
    method: 'POST',
  });
}
export async function queryMyCourse() {
  return request('http://lab.lli.fun/api/v1/course/courseList', {
    method: 'POST',
    body: {},
  });
}
export async function changeCourseState({ courseId, courseState }) {
  return request(
    `http://lab.lli.fun/lab/api/v1/course/checkCourse?courseId=${courseId}&courseState=${courseState}`,
    {
      method: 'POST',
    }
  );
}
export async function delCourse({ courseId, courseState }) {
  return request(
    `http://lab.lli.fun/lab/api/v1/course/deleteCourse?courseId=${courseId}&courseState=${courseState}`,
    {
      method: 'POST',
    }
  );
}
export async function searchCourse() {
  return request(`http://lab.lli.fun/lab/api/v1/course/stateCourseList`, {
    method: 'POST',
  });
}
export async function select(params) {
  return request(
    `http://lab.lli.fun/lab/api/v1/course/selectCourse?courseId=${params.courseId}&password=${
      params.password
    }`,
    {
      method: 'POST',
    }
  );
}
export async function quit(params) {
  return request(`http://lab.lli.fun/lab/api/v1/course/dropCourse?courseId=${params.courseId}`, {
    method: 'POST',
  });
}
export async function addNotice(params) {
  return request(`http://lab.lli.fun/lab/api/v1/anno/publishAnno`, {
    method: 'POST',
    body: params,
  });
}
export async function queryNotice(params) {
  return request(`http://lab.lli.fun/lab/api/v1/anno/annoList`, {
    method: 'GET',
  });
}
export async function addLab(params) {
  return request(`http://lab.lli.fun/lab/api/v1/lab/addLab`, {
    method: 'POST',
    body: params,
  });
}
export async function queryLab(params) {
  return request(`http://lab.lli.fun/lab/api/v1/lab/labList?courseId=${params.courseId}`, {
    method: 'POST',
  });
}

export async function queryMyLab(params) {
  return request(`http://lab.lli.fun/lab/api/v1/lab/labScoreList?courseId=${params.courseId}`, {
    method: 'GET',
  });
}
export async function queryScore(params) {
  return request(`http://lab.lli.fun/lab/api/v1/lab/scoreList?labId=${params.labId}`, {
    method: 'POST',
    body: {},
  });
}
export async function addBlog(params) {
  return request(`http://lab.lli.fun/lab/api/v1/blog/publishBlog`, {
    method: 'POST',
    body: params,
  });
}
export async function queryBlog(params) {
  console.log(params);
  return request(`http://lab.lli.fun/lab/api/v1/blog/blogList?courseId=${params.courseId}`, {
    method: 'POST',
    body: {
      page: params.page,
      pageSize: params.pageSize,
      sort: 'asc',
    },
  });
}
export async function queryMyBlog(params) {
  return request(`http://lab.lli.fun/lab/api/v1/blog/userBlogList`, {
    method: 'POST',
    body: {
      page: params.page,
      pageSize: params.pageSize,
      sort: 'asc',
    },
  });
}
export async function searchBlog(params) {
  return request(`http://lab.lli.fun/lab/api/v1/blog/searchBlog?param=${params.param}`, {
    method: 'POST',
    body: {
      page: params.page,
      pageSize: params.pageSize,
      sort: 'asc',
    },
  });
}
export async function addCommit(params) {
  return request(`http://lab.lli.fun/lab/api/v1/lab/labCommit`, {
    method: 'POST',
    body: params,
  });
}
export async function addScore(params) {
  return request(
    `http://lab.lli.fun/lab/api/v1/lab/addLabScore?labId=${params.labId}&score=${
      params.score
    }&userId=${params.userId}`,
    {
      method: 'POST',
    }
  );
}
export async function addComment(params) {
  return request(`http://lab.lli.fun/lab/api/v1/blog/publishComment`, {
    method: 'POST',
    body: params,
  });
}
export async function getComment(params) {
  return request(`http://lab.lli.fun/lab/api/v1/blog/getComments?parentId=${params.parentId}`, {
    method: 'POST',
  });
}
export async function register(params) {
  console.log(params);
  return Axios.post(`http://lab.lli.fun/lab/api/v1/user/regist`, params);
}
export async function queryUsers(params) {
  return request(`http://lab.lli.fun/lab/api/v1/user/getAllUser`, {
    method: 'POST',
    body: params,
  });
}
export async function delUser(params) {
  return request(`http://lab.lli.fun/lab/api/v1/user/deleteUser?userId=${params.userId}`, {
    method: 'GET',
  });
}
export async function modifyUser(params) {
  return request(
    `http://lab.lli.fun/lab/api/v1/user/updateState?role=${params.role}&userId=${params.userId}`,
    {
      method: 'GET',
    }
  );
}
