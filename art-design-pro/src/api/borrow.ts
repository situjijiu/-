/**
 * 借阅相关API接口
 *
 * 提供借阅图书、归还图书、积分兑换和查询借阅记录等功能
 */
import request from '@/utils/http'

/**
 * 借阅请求参数
 */
export interface BorrowRequest {
  bookId: string
  days: number
}

/**
 * 归还请求参数
 */
export interface ReturnRequest {
  borrowId: string
}

/**
 * 积分兑换请求参数
 */
export interface PointExchangeRequest {
  borrowId: string
  days: number
}

/**
 * 借阅记录查询请求参数
 */
export interface BorrowListRequest {
  current?: number
  size?: number
  bookId?: string
  status?: string
  userId?: string
}

/**
 * 借阅记录
 */
export interface BorrowRecord {
  id: number
  bookId: number
  bookName: string
  userId: number
  borrowDate: string
  dueDate: string
  returnDate?: string | null
  status: number
  extraDays: number
  pointReward: number
  createAt: string
  updateAt: string
}

/**
 * 借阅图书
 * @param params 借阅请求参数
 * @returns 借阅结果
 */
export function fetchBorrowBook(params: BorrowRequest) {
  return request.post({
    url: '/api/borrow/borrow',
    data: params
  })
}

/**
 * 归还图书
 * @param params 归还请求参数
 * @returns 归还结果
 */
export function fetchReturnBook(params: ReturnRequest) {
  return request.post({
    url: '/api/borrow/return',
    data: params
  })
}

/**
 * 积分兑换额外借阅时长
 * @param params 积分兑换请求参数
 * @returns 兑换结果
 */
export function fetchExchangePoints(params: PointExchangeRequest) {
  return request.post({
    url: '/api/borrow/exchange',
    data: params
  })
}

/**
 * 查询借阅记录列表
 * @param params 查询请求参数
 * @returns 借阅记录列表
 */
export function fetchGetBorrowList(params: BorrowListRequest) {
  return request.post({
    url: '/api/borrow/list',
    data: params
  })
}
