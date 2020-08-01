import Layout from '@/layout/Index'

//应用管理
export default [
  {
    path: '/applicationManagement',
    component: Layout,
    children: [
      {
        path: 'flowManage', //流程管理
        name: 'FlowManage',
        component: () => import('@/views/flowManage/Index.vue'),
        meta: {
          title: '流程管理',
          name: 'FlowManage',
          authentication: true
        }
      },
      {
        path: 'flowManage/add-flow', //新增流程
        name: 'AddFlow',
        component: () =>
          import('@/views/flowManage/flowModule/addFlow/Index.vue'),
        meta: {
          title: '新增流程',
          name: 'AddFlow',
          authentication: true
        }
      }
    ]
  }
]
