import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'

/* Router Modules */
import componentsRouter from './modules/components'
import chartsRouter from './modules/charts'
import tableRouter from './modules/table'
import treeTableRouter from './modules/tree-table'
import nestedRouter from './modules/nested'

/** note: sub-menu only appear when children.length>=1
 *  detail see  https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 **/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']    will control the page roles (you can set multiple roles)
    title: 'title'               the name show in sub-menu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if true, the page will no be cached(default is false)
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
    affix: true                  if true, the tag will affix in the tags-view
  }
**/
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/authredirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/errorPage/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401'),
    hidden: true
  },
  // {
  //   path: '',
  //   component: Layout,
  //   redirect: 'dashboard',
  //   children: [
  //     {
  //       path: 'dashboard',
  //       component: () => import('@/views/dashboard/index'),
  //       name: 'Dashboard',
  //       meta: { title: 'dashboard', icon: 'dashboard', noCache: true, affix: true }
  //     }
  //   ]
  // },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/repflightflyincome/index'),
        name: 'Dashboard',
        meta: { title: '承运航班收入数据', icon: 'dashboard', noCache: true, affix: true }
      }
    ]
  },
  // {
  //   path: '/repflyincome',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/repflightflyincome/index'),
  //       name: '承运航班收入数据',
  //       meta: { title: '承运航班收入数据', icon: 'guide'}
  //     }
  //   ]
  // },

  {
    path: '/repcompeting',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/repcompetingflights/index'),
        name: '未来航班上客速度',
        meta: { title: '未来航班上客速度', icon: 'tab'}
      }
    ]
  },
  // {
  //   path: '/financial',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/financial/index'),
  //       name: '未来航班销售监控',
  //       meta: { title: '未来航班销售监控', icon: 'guide' }
  //     }
  //   ]
  // },
  {
    path: '/lowestprice',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/lowestprice/index'),
        name: '航班OTA价格查询',
        meta: { title: '航班OTA价格查询', icon: 'link' }
      }
    ]
  },
  {
    path: '/crowrate',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/crowrate/index'),
        name: '航班客座率查询',
        meta: { title: '航班客座率查询', icon: 'list' }
      }
    ]
  },
  
  {
    path: '/yyhs',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/yyhs/index'),
        name: '实时查询客座率',
        meta: { title: '实时查询客座率', icon: 'documentation' }
      }
    ]
  },
  {
    path: '/yypr',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/yypr/index'),
        name: '实时查询OTA最低价',
        meta: { title: '实时查询OTA最低价', icon: 'documentation' }
      }
    ]
  },
  // {
  //   path: '/warning',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/warning/index'),
  //       name: '预警规则维护',
  //       meta: { title: '预警规则维护', icon: 'documentation' }
  //     }
  //   ]
  // },
  // {
  //   path: '/repflyincome',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/repflightflyincome/index'),
  //       name: '承运航班收入数据',
  //       meta: { title: '承运航班收入数据', icon: 'guide'}
  //     }
  //   ]
  // },
  // {
  //   path: '/documentation',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/documentation/index'),
  //       name: 'Documentation',
  //       meta: { title: 'documentation', icon: 'documentation', affix: true }
  //     }
  //   ]
  // }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

export const asyncRoutes = [
  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/index',
    alwaysShow: true, // will always show the root menu
    meta: {
      title: '系统设置',
      icon: 'lock',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    // children: [
    //   {
    //     path: 'page',
    //     component: () => import('@/views/permission/page'),
    //     name: 'PagePermission',
    //     meta: {
    //       title: 'pagePermission',
    //       roles: ['admin'] // or you can only set roles in sub nav
    //     }
    //   },
    //   {
    //     path: 'directive',
    //     component: () => import('@/views/permission/directive'),
    //     name: 'DirectivePermission',
    //     meta: {
    //       title: 'directivePermission'
    //       // if do not set roles, means: this page does not require permission
    //     }
    //   },
    //   {
    //     path: 'role',
    //     component: () => import('@/views/permission/role'),
    //     name: 'RolePermission',
    //     meta: {
    //       title: 'rolePermission',
    //       roles: ['admin']
    //     }
    //   }
    // ]
  },

  /** When your routing table is too long, you can split it into small modules**/
  // componentsRouter,
  // chartsRouter,
  // nestedRouter,
  // tableRouter,
  // treeTableRouter,

  // {
  //   path: '/error',
  //   component: Layout,
  //   redirect: 'noredirect',
  //   name: 'ErrorPages',
  //   meta: {
  //     title: 'errorPages',
  //     icon: '404'
  //   },
  //   children: [
  //     {
  //       path: '401',
  //       component: () => import('@/views/errorPage/401'),
  //       name: 'Page401',
  //       meta: { title: 'page401', noCache: true }
  //     },
  //     {
  //       path: '404',
  //       component: () => import('@/views/errorPage/404'),
  //       name: 'Page404',
  //       meta: { title: 'page404', noCache: true }
  //     }
  //   ]
  // },

  // {
  //   path: '/i18n',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/i18n-demo/index'),
  //       name: 'I18n',
  //       meta: { title: 'i18n', icon: 'international' }
  //     }
  //   ]
  // },



  { path: '*', redirect: '/404', hidden: true }
]
