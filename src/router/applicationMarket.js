import Layout from '@/layout/Index'

//应用市场
export default [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: 'applicationMarket', //应用市场
        name: 'ApplicationMarket',
        component: () => import('@/views/applicationMarket/Index.vue'),
        meta: {
          title: '应用市场',
          name: 'ApplicationMarket',
          authentication: true
        }
      }
    ]
  }
]
