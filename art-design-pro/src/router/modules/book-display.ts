import { AppRouteRecord } from '@/types/router'

export const bookDisplayRoutes: AppRouteRecord = {
  path: '/book-display',
  name: 'BookDisplay',
  component: '/index/index',
  meta: {
    title: 'menus.bookDisplay.title',
    icon: 'ri:book-open-line'
  },
  children: [
    {
      path: 'list',
      name: 'BookDisplayList',
      component: '/book-display/index',
      meta: {
        title: 'menus.bookDisplay.list',
        keepAlive: true
      }
    }
  ]
}