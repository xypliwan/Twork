import Layout from '@/layout/Index'

//我的待办（流程模块）
export default [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: 'agentManage', //流程模块
        name: 'agentManage',
        redirect: 'agentManage/initiationPprocess',
        component: () => import('@/views/AgentManage/index.vue'),
        children: [
          {
            path: 'initiationPprocess', //发起流程
            name: 'initiationPprocess',
            component: () =>
              import('@/views/AgentManage/initiationPprocess/index.vue'),
            meta: {
              title: '流程',
              name: 'agentManage',
              authentication: true
            }
          },
          {
            path: 'pend', //待我处理的
            name: 'pend',
            component: () => import('@/views/AgentManage/pend/index.vue'),
            meta: {
              title: '流程',
              name: 'agentManage',
              authentication: true
            }
          },
          {
            path: 'processed', //我已处理的
            name: 'processed',
            component: () => import('@/views/AgentManage/processed/index.vue'),
            meta: {
              title: '流程',
              name: 'agentManage',
              authentication: true
            }
          },
          {
            path: 'initiated', //我发起的
            name: 'initiated',
            component: () => import('@/views/AgentManage/initiated/index.vue'),
            meta: {
              title: '流程',
              name: 'agentManage',
              authentication: true
            }
          },
          {
            path: 'copyme', //抄送我的
            name: 'copyme',
            component: () => import('@/views/AgentManage/copyme/index.vue'),
            meta: {
              title: '流程',
              name: 'agentManage',
              authentication: true
            }
          }
        ],
        meta: {
          title: '我的事项',
          name: 'agentManage',
          authentication: true
        }
      }
    ]
  }
]
