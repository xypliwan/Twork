import Layout from '@/layout/Index'

//系统设置
export default [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: 'systemSetting', //系统设置
        name: 'SystemSetting',
        component: () => import('@/views/systemSetting/Index.vue'),
        meta: {
          title: '系统设置',
          name: 'SystemSetting',
          authentication: true
        },
        children: [
          {
            path: 'companyInfo', //企业信息
            name: 'CompanyInfo',
            component: () =>
              import('@/views/systemSetting/companyInfo/Index.vue'),
            meta: {
              title: '企业信息',
              name: 'CompanyInfo',
              authentication: true
            }
          },
          {
            path: 'rolePermission', //角色权限
            name: 'RolePermission',
            component: () =>
              import('@/views/systemSetting/rolePermission/Index.vue'),
            meta: {
              title: '角色权限',
              name: 'RolePermission',
              authentication: true
            }
          },
          {
            path: 'userMembers', //用户成员
            name: 'UserMembers',
            component: () =>
              import('@/views/systemSetting/userMembers/Index.vue'),
            meta: {
              title: '用户成员',
              name: 'UserMembers',
              authentication: true
            }
          },
          {
            path: 'adminLog', //管理日志
            name: 'AdminLog',
            component: () => import('@/views/systemSetting/adminLog/Index.vue'),
            meta: {
              title: '管理日志',
              name: 'AdminLog',
              authentication: true
            }
          },
          {
            path: 'bindingNailing', //绑定钉钉
            name: 'BindingNailing',
            component: () =>
              import('@/views/systemSetting/bindingNailing/Index.vue'),
            meta: {
              title: '绑定钉钉',
              name: 'BindingNailing',
              authentication: true
            }
          },
          {
            path: 'cycle-management', //周期管理
            name: 'CycleManagement',
            component: () =>
              import('@/views/systemSetting/cycle-management/index.vue'),
            meta: {
              title: '周期管理',
              name: 'CycleManagement',
              authentication: true
            }
          }
        ]
      }
    ]
  }
]
