import Layout from '@/layout/Index'

//汇报
export default [
  {
    path: '/report',
    component: Layout,
    children: [
      {
        path: 'report-management',
        name: 'ReportIndex',
        component: () => import('@/views/report'),
        meta: {
          title: '汇报',
          name: 'ReportIndex',
          authentication: true
        }
      },
      {
        path: 'add-report', //新增汇报
        name: 'AddReport',
        component: () => import('@/views/report/add-report'),
        meta: {
          title: '新增汇报',
          name: 'AddReport',
          authentication: true
        }
      }
    ]
  }
]
