# 登录后发送多个获取用户信息请求及个人信息页面展示问题修复计划

## [x] 任务 1: 修复路由守卫中获取用户信息的处理逻辑
- **优先级**: P0
- **Depends On**: 无
- **Description**:
  - 修改 `src/router/guards/beforeEach.ts` 中的 `fetchUserInfo` 函数
  - 确保正确处理 API 响应结构，从 `data.data` 中获取用户信息
- **Success Criteria**:
  - 路由守卫中获取的用户信息能正确存储到 userStore 中
  - 个人信息页面能够展示用户信息
- **Test Requirements**:
  - `programmatic` TR-1.1: 登录后，个人信息页面能正确展示用户信息
  - `programmatic` TR-1.2: 控制台没有报错
- **Notes**: 这是导致个人信息页面无法展示用户信息的根本原因

## [x] 任务 2: 优化登录流程，避免重复获取用户信息
- **优先级**: P1
- **Depends On**: 任务 1
- **Description**:
  - 修改 `src/views/auth/login/index.vue` 中的登录流程
  - 登录成功后不再立即获取用户信息，让路由守卫统一处理
- **Success Criteria**:
  - 登录后只发送两个获取用户信息的请求（路由守卫和用户中心页面）
  - 登录流程正常，能够正确跳转到首页
- **Test Requirements**:
  - `programmatic` TR-2.1: 登录后，网络请求中只包含两个获取用户信息的请求
  - `programmatic` TR-2.2: 登录后能正确跳转到首页
- **Notes**: 减少重复请求，提高性能

## [x] 任务 3: 优化用户中心页面，避免重复获取用户信息
- **优先级**: P1
- **Depends On**: 任务 1
- **Description**:
  - 修改 `src/views/system/user-center/index.vue` 中的 `getUserInfo` 函数
  - 优先使用 userStore 中已存储的用户信息，当信息不存在或需要更新时才发送请求
- **Success Criteria**:
  - 登录后只发送一个获取用户信息的请求（路由守卫）
  - 用户中心页面能够正确展示用户信息
- **Test Requirements**:
  - `programmatic` TR-3.1: 登录后，网络请求中只包含一个获取用户信息的请求
  - `programmatic` TR-3.2: 用户中心页面能正确展示用户信息
- **Notes**: 进一步减少重复请求，提高性能

## [x] 任务 4: 测试验证
- **优先级**: P2
- **Depends On**: 任务 1、任务 2、任务 3
- **Description**:
  - 测试登录流程
  - 测试个人信息页面展示
  - 测试用户信息更新功能
- **Success Criteria**:
  - 登录流程正常，无重复请求
  - 个人信息页面能正确展示用户信息
  - 用户信息更新功能正常
- **Test Requirements**:
  - `programmatic` TR-4.1: 登录后，网络请求中只包含一个获取用户信息的请求
  - `programmatic` TR-4.2: 个人信息页面能正确展示用户信息
  - `programmatic` TR-4.3: 用户信息更新后，页面能正确展示更新后的信息
- **Notes**: 确保所有功能正常工作