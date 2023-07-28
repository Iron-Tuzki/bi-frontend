export default [
  {
    path: '/user',
    layout: false,
    routes: [
      { name: '登录', path: '/user/login', component: './User/Login' },
      { name: '注册', path: '/user/register', component: './User/Register' },
    ],
  },
  {
    path: '/',
    redirect: '/add_chart',
  },
  {
    name: '数据智能分析', path: '/add_chart', icon: 'barChart', component: './AddChart'
  },
  {
    name: '数据智能分析（异步）', path: '/add_chart_async', icon: 'barChart', component: './AddChartAsync',
  },
  {
    name: '数据智能分析（消息队列）', path: '/add_chart_mq', icon: 'barChart', component: './AddChartMq',
  },
  {
    name: '我的图表（预览）', path: '/myChart/preview', icon: 'TableOutlined', component: './MyChart/Preview'
  },
  {
    name: '我的图表信息', path: '/myChart/detail', icon: 'TableOutlined', component: './MyChart/Detail'
  },
  {
    name: '用户信息', path: '/user/info', icon: 'UserOutlined', component: './User/Info'
  },
  { path: '/welcome', name: '欢迎', icon: 'smile', component: './Welcome' },
  {
    path: '/admin',
    name: '管理页',
    icon: 'crown',
    access: 'canAdmin',
    routes: [
      { path: '/admin', redirect: '/admin/sub-page' },
      { path: '/admin/sub-page', name: '二级管理页', component: './Admin' },
    ],
  },
  { path: '/', redirect: '/welcome' },
  { path: '*', layout: false, component: './404' },
];
