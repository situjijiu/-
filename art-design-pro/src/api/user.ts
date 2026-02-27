import request from '@/utils/http'

/**
 * 获取用户信息
 * @returns 用户信息
 */
export function fetchGetUserInfo() {
  return request.get<Api.User.UserInfo>({
    url: '/api/user/info'
    // 自定义请求头
    // headers: {
    //   'X-Custom-Header': 'your-custom-value'
    // }
  })
}

/**
 * 更新用户信息
 * @param params 更新用户信息参数
 * @returns 更新用户信息响应
 */
export function fetchUpdateUserInfo(params: Api.User.UpdateUserInfoParams) {
  return request.put<Api.User.UpdateUserInfoResponse>({ 
    url: "/api/user/update",
    data: params
  })
}
