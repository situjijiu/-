import request from '@/utils/http'
import { AppRouteRecord } from '@/types/router'

// 获取用户列表
export function fetchGetUserList(params: Api.SystemManage.UserSearchParams) {
  return request.get<Api.SystemManage.UserList>({
    url: '/api/user/list',
    params
  })
}

// 获取角色列表
export function fetchGetRoleList() {
  // 模拟返回数据，符合要求的格式
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        msg: '查询成功',
        data: ['SUPER_ADMIN', 'ADMIN', 'USER']
      })
    }, 500)
  })
}


