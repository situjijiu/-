import request from '@/utils/http'

/**
 * 图书列表项
 */
export interface BookListItem {
  id: number
  title: string
  author: string
  isbn: string
  publisher: string
  publishDate: string
  price: number
  cover: string
  description: string
  createdAt: string
  updatedAt: string
}

/**
 * 图书搜索参数
 */
export interface BookSearchParams {
  current?: number
  size?: number
  title?: string
  author?: string
  isbn?: string
  publisher?: string
}

/**
 * 新增图书参数
 */
export interface AddBookParams {
  title: string
  author: string
  isbn: string
  publisher: string
  publishDate: string
  price: number
  cover: string
  description: string
}

/**
 * 编辑图书参数
 */
export interface UpdateBookParams {
  id: number
  title: string
  author: string
  isbn: string
  publisher: string
  publishDate: string
  price: number
  cover: string
  description: string
}

/**
 * 删除图书参数
 */
export interface DeleteBookParams {
  id: number | number[]
}

/**
 * 图书响应
 */
export interface BookResponse {
  code: number
  msg: string
  data?: any
}

/**
 * 图书列表响应
 */
export interface BookListResponse {
  code: number
  msg: string
  data: BookListItem[]
  total: number
}

/**
 * 获取图书列表
 * @param params 搜索参数
 * @returns 图书列表响应
 */
export function fetchGetBookList(params: BookSearchParams) {
  return request.post<BookListResponse>({
    url: '/api/book/list',
    data: params
  })
}

/**
 * 新增图书
 * @param params 图书信息
 * @returns 响应结果
 */
export function fetchAddBook(params: AddBookParams) {
  return request.post<BookResponse>({
    url: '/api/book/add',
    data: params
  })
}

/**
 * 更新图书
 * @param params 图书信息
 * @returns 响应结果
 */
export function fetchUpdateBook(params: UpdateBookParams) {
  return request.put<BookResponse>({
    url: '/api/book/update',
    data: params
  })
}

/**
 * 删除图书
 * @param params 删除参数
 * @returns 响应结果
 */
export function fetchDeleteBook(params: DeleteBookParams) {
  return request.del<BookResponse>({
    url: '/api/book/delete',
    params
  })
}

/**
 * 获取图书封面
 * @param coverPath 封面路径
 * @returns 封面图片
 */
export function fetchGetBookCover(coverPath: string) {
  // 提取文件名
  const filename = coverPath.split('/').pop()
  return request.get<Blob>({
    url: `/api/book/cover/${filename}`,
    responseType: 'blob'
  })
}