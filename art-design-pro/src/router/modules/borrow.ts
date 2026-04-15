import { AppRouteRecord } from '@/types/router'

/**
 * 借阅相关路由
 */
export const borrowRoutes: AppRouteRecord = {
  path: '/borrow',
  name: 'Borrow',
  component: '/index/index',
  meta: {
    title: 'menus.borrow.title',
    icon: 'ri:book-open-line',
    roles: ['R_SUPER', 'R_ADMIN', 'R_USER']
  },
  children: [
    {
      path: 'list',
      name: 'BorrowList',
      component: '/borrow/index',
      meta: {
        title: 'menus.borrow.list',
        keepAlive: true,
        roles: ['R_SUPER', 'R_ADMIN', 'R_USER']
      }
    }
  ]
}
