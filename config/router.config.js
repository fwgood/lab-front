export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    routes: [
      // dashboard
      {
        path: '/',
        redirect: '/dashboard',
      },
      {
        path: '/dashboard',
        name: 'dashboard',
        icon: 'dashboard',
        component: './Home/Intro',
      },
      // forms
      {
        path: '/form',
        icon: 'form',
        name: 'form',
        authority: ['1', '2'],
        routes: [
          {
            path: '/form/basic-form',
            name: 'basicform',
            component: './Term/CurrentTerm',
          },
          // {
          //   path: '/form/step-form',
          //   name: 'stepform',
          //   component: './Forms/StepForm',
          // },
          // {
          //   path: '/form/advanced-form',
          //   name: 'advancedform',
          //   component: './Forms/AdvancedForm',
          // },
          // {
          //   path: '/form/add-course',
          //   name: 'addCourse',
          //   component: './Forms/AddCourse',
          // },
        ],
      },
      {
        path: '/manage-course',
        name: 'manage-course',
        icon: 'form',
        authority: ['1', '0'],
        routes: [
          {
            path: '/manage-course/add-course',
            name: 'addCourse',
            component: './Course/AddCourse',
            authority: ['1'],
          },

          {
            path: '/manage-course/manage-course',
            name: 'manageCourse',
            component: './Course/ManageCourse',
            authority: ['0'],
          },
        ],
      },
      {
        path: '/course',
        name: 'course',
        hideInMenu: true,
        routes: [
          {
            path: '/course/detail',
            name: 'courseDetail',
            component: './Term/CourseInfo',
          },
          {
            path: '/course/grade',
            name: 'grade',
            hideInMenu: true,
            component: './Grade/Grade',
          },
        ],
      },
      // list
      {
        path: '/list',
        icon: 'table',
        name: 'list',
        hideInMenu: true,
        routes: [
          {
            path: '/list/table-list',
            name: 'searchtable',
            component: './List/TableList',
          },
          {
            path: '/list/basic-list',
            name: 'basiclist',
            component: './List/BasicList',
          },
          {
            path: '/list/card-list',
            name: 'cardlist',
            component: './List/CardList',
          },
          {
            path: '/list/search',
            name: 'searchlist',
            component: './List/List',
            routes: [
              {
                path: '/list/search',
                redirect: '/list/search/articles',
              },
              {
                path: '/list/search/articles',
                name: 'articles',
                component: './List/Articles',
              },
              {
                path: '/list/search/projects',
                name: 'projects',
                component: './List/Projects',
              },
              {
                path: '/list/search/applications',
                name: 'applications',
                component: './List/Applications',
              },
            ],
          },
        ],
      },
      {
        path: '/profile',
        name: 'profile',
        icon: 'profile',
        hideInMenu: true,
        routes: [
          // profile
          {
            path: '/profile/basic',
            name: 'basic',
            component: './Profile/BasicProfile',
          },
          {
            path: '/profile/advanced',
            name: 'advanced',
            component: './Profile/AdvancedProfile',
          },
        ],
      },
      {
        name: 'result',
        icon: 'check-circle-o',
        path: '/result',
        hideInMenu: true,
        routes: [
          // result
          {
            path: '/result/success',
            name: 'success',
            component: './Result/Success',
          },
          { path: '/result/fail', name: 'fail', component: './Result/Error' },
        ],
      },
      {
        name: 'exception',
        icon: 'warning',
        path: '/exception',
        hideInMenu: true,
        routes: [
          // exception
          {
            path: '/exception/403',
            name: 'not-permission',
            component: './Exception/403',
          },
          {
            path: '/exception/404',
            name: 'not-find',
            component: './Exception/404',
          },
          {
            path: '/exception/500',
            name: 'server-error',
            component: './Exception/500',
          },
          {
            path: '/exception/trigger',
            name: 'trigger',
            hideInMenu: true,
            component: './Exception/TriggerException',
          },
        ],
      },
      {
        name: 'account',
        icon: 'user',
        path: '/account',
        routes: [
          {
            path: '/account/center',
            name: 'center',
            component: './Account/Center/Center',
            routes: [
              {
                path: '/account/center',
                redirect: '/account/center/articles',
              },
              {
                path: '/account/center/articles',
                component: './Account/Center/Articles',
              },
              {
                path: '/account/center/applications',
                component: './Account/Center/Applications',
              },
              {
                path: '/account/center/projects',
                component: './Account/Center/Projects',
              },
            ],
          },
          {
            path: '/account/discuss',
            name: 'discuss',
            component: './Discuss/Discuss',
          },
        ],
      },
      {
        component: '404',
      },
    ],
  },
];
