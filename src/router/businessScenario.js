import Layout from '@/layout/Index'

//应用市场
export default [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: 'business-scenario', //业务场景
        name: 'SusinessScenario',
        component: () => import('@/views/business-scenario/indexs.vue'),
        meta: {
          title: '业务场景',
          name: 'SusinessScenario',
          authentication: true
        }
      },
      {
        path: 'add-scenario', //新增业务场景
        name: 'AddScenario',
        component: () =>
          import('@/views/business-scenario/add-scenario/index.vue'),
        meta: {
          title: '新增业务场景',
          name: 'AddScenario',
          authentication: true
        }
      }
    ]
  }
]
