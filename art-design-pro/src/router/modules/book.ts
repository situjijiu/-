import { AppRouteRecord } from '@/types/router'

export const bookRoutes: AppRouteRecord = {
  path: '/book',
  name: 'Book',
  component: '/index/index',
  meta: {
    title: 'menus.book.title',
    icon: 'ri:book-line',
    roles: ['R_SUPER', 'R_ADMIN']
  },
  children: [
    {
      path: 'list',
      name: 'BookList',
      component: '/book/index',
      meta: {
        title: 'menus.book.list',
        keepAlive: true,
        roles: ['R_SUPER', 'R_ADMIN']
      }
    }
  ]
}