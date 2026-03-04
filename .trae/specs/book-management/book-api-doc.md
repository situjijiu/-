# 图书管理API接口文档

## 1. 接口概述

本文档定义了智能图书推荐与管理系统中图书管理模块的API接口规范，包括图书的增删改查等操作。后端开发人员应根据本文档实现相应的API接口。

## 2. 接口列表

| 接口名称 | URL | 方法 | 功能描述 |
|---------|-----|------|----------|
| 获取图书列表 | /api/book/list | POST | 获取图书列表，支持分页和搜索 |
| 添加图书 | /api/book/add | POST | 添加新图书 |
| 更新图书 | /api/book/update | PUT | 更新图书信息 |
| 删除图书 | /api/book/delete | DELETE | 删除图书，支持单个和批量删除 |

## 3. 接口详情

### 3.1 获取图书列表

**URL**: /api/book/list

**方法**: POST

**请求参数**:

| 参数名 | 类型 | 必填 | 描述 |
|-------|------|------|------|
| current | number | 否 | 当前页码，默认0 |
| size | number | 否 | 每页大小，默认10 |
| title | string | 否 | 书名 |
| author | string | 否 | 作者 |
| isbn | string | 否 | ISBN |
| publisher | string | 否 | 出版社 |

**请求示例**:
```json
{
  "current": 0,
  "size": 10,
  "title": "JavaScript",
  "author": "张三"
}
```

**响应格式**:

| 字段名 | 类型 | 描述 |
|-------|------|------|
| code | number | 响应状态码，200表示成功 |
| msg | string | 响应消息 |
| data | array | 图书列表数据 |
| total | number | 总记录数 |

**响应示例**:
```json
{
  "code": 200,
  "msg": "查询成功",
  "data": [
    {
      "id": 1,
      "title": "JavaScript高级程序设计",
      "author": "尼古拉斯·扎卡斯",
      "isbn": "9787115275790",
      "publisher": "人民邮电出版社",
      "publishDate": "2012-03-01",
      "price": 99.00,
      "cover": "/covers/js-advanced.jpg",
      "description": "本书是JavaScript领域的经典之作，全面介绍了JavaScript语言的核心概念和高级特性。",
      "createdAt": "2026-03-01T10:00:00",
      "updatedAt": "2026-03-01T10:00:00"
    }
  ],
  "total": 1
}
```

### 3.2 添加图书

**URL**: /api/book/add

**方法**: POST

**请求参数**:

| 参数名 | 类型 | 必填 | 描述 |
|-------|------|------|------|
| title | string | 是 | 书名 |
| author | string | 是 | 作者 |
| isbn | string | 是 | ISBN |
| publisher | string | 是 | 出版社 |
| publishDate | string | 是 | 出版日期，格式：YYYY-MM-DD |
| price | number | 是 | 价格 |
| cover | string | 是 | 封面图片URL |
| description | string | 是 | 描述 |

**请求示例**:
```json
{
  "title": "TypeScript实战",
  "author": "梁宵",
  "isbn": "9787115511718",
  "publisher": "人民邮电出版社",
  "publishDate": "2019-11-01",
  "price": 89.00,
  "cover": "/covers/typescript-practice.jpg",
  "description": "本书从TypeScript的核心概念入手，通过大量实例讲解TypeScript的使用方法和最佳实践。"
}
```

**响应格式**:

| 字段名 | 类型 | 描述 |
|-------|------|------|
| code | number | 响应状态码，200表示成功 |
| msg | string | 响应消息 |
| data | any | 响应数据，可返回添加的图书ID |

**响应示例**:
```json
{
  "code": 200,
  "msg": "添加成功",
  "data": 2
}
```

### 3.3 更新图书

**URL**: /api/book/update

**方法**: PUT

**请求参数**:

| 参数名 | 类型 | 必填 | 描述 |
|-------|------|------|------|
| id | number | 是 | 图书ID |
| title | string | 是 | 书名 |
| author | string | 是 | 作者 |
| isbn | string | 是 | ISBN |
| publisher | string | 是 | 出版社 |
| publishDate | string | 是 | 出版日期，格式：YYYY-MM-DD |
| price | number | 是 | 价格 |
| cover | string | 是 | 封面图片URL |
| description | string | 是 | 描述 |

**请求示例**:
```json
{
  "id": 1,
  "title": "JavaScript高级程序设计（第4版）",
  "author": "尼古拉斯·扎卡斯",
  "isbn": "9787115536372",
  "publisher": "人民邮电出版社",
  "publishDate": "2020-01-01",
  "price": 109.00,
  "cover": "/covers/js-advanced-4th.jpg",
  "description": "本书是JavaScript领域的经典之作，全面介绍了JavaScript语言的核心概念和高级特性。"
}
```

**响应格式**:

| 字段名 | 类型 | 描述 |
|-------|------|------|
| code | number | 响应状态码，200表示成功 |
| msg | string | 响应消息 |
| data | any | 响应数据 |

**响应示例**:
```json
{
  "code": 200,
  "msg": "更新成功",
  "data": null
}
```

### 3.4 删除图书

**URL**: /api/book/delete

**方法**: DELETE

**请求参数**:

| 参数名 | 类型 | 必填 | 描述 |
|-------|------|------|------|
| id | number/array | 是 | 图书ID，单个ID或ID数组 |

**请求示例**:

单个删除：
```json
{
  "id": 1
}
```

批量删除：
```json
{
  "id": [1, 2, 3]
}
```

**响应格式**:

| 字段名 | 类型 | 描述 |
|-------|------|------|
| code | number | 响应状态码，200表示成功 |
| msg | string | 响应消息 |
| data | any | 响应数据 |

**响应示例**:
```json
{
  "code": 200,
  "msg": "删除成功",
  "data": null
}
```

## 4. 数据模型

### 4.1 图书模型

| 字段名 | 类型 | 描述 |
|-------|------|------|
| id | number | 图书ID |
| title | string | 书名 |
| author | string | 作者 |
| isbn | string | ISBN |
| publisher | string | 出版社 |
| publishDate | string | 出版日期 |
| price | number | 价格 |
| cover | string | 封面图片URL |
| description | string | 描述 |
| createdAt | string | 创建时间 |
| updatedAt | string | 更新时间 |

## 5. 错误处理

所有API接口应返回统一的错误格式：

```json
{
  "code": 错误码,
  "msg": "错误消息",
  "data": null
}
```

常见错误码：
- 400：请求参数错误
- 401：未授权
- 403：禁止访问
- 404：资源不存在
- 500：服务器内部错误

## 6. 注意事项

1. 所有API接口都需要进行权限验证，确保只有管理员可以访问
2. 图书封面图片上传功能需要单独实现，本文档只定义了封面图片的URL字段
3. 分页参数中，current从0开始计数
4. 批量删除时，id参数为数组格式
5. 日期格式统一使用YYYY-MM-DD
6. 价格字段使用小数类型，保留两位小数