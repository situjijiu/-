import { AppRouteRecord } from '@/types/router'
import { dashboardRoutes } from './dashboard'
import { systemRoutes } from './system'
import { bookRoutes } from './book'
import { bookDisplayRoutes } from './book-display'
import { borrowRoutes } from './borrow'
import { resultRoutes } from './result'
import { exceptionRoutes } from './exception'

/**
 * 导出所有模块化路由
 */
export const routeModules: AppRouteRecord[] = [
  dashboardRoutes,
  systemRoutes,
  bookRoutes,
  bookDisplayRoutes,
  borrowRoutes,
  resultRoutes,
  exceptionRoutes
]
