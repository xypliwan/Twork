import Layout from '@/layout/Index'

//公共
export default [
  {
    path: '/entrance/login',
    component: () => import('@/views/entrance/Login.vue'),
    meta: {
      authentication: false,
      keepAlive: false
    }
  },
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: 'home', //首页
        name: 'Home',
        component: () => import('@/views/home/Index.vue'),
        meta: {
          title: '首页',
          name: 'Home',
          authentication: true
          // keepAlive: true
        }
      }
    ]
  }
]
