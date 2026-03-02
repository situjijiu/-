 # Multiavatar 依赖使用总结
Multiavatar 是一款**原生 JavaScript 编写的多文化头像生成工具**，核心能力是通过输入字符串生成唯一的 SVG 头像（理论上限 **12,230,590,464** 个），支持本地集成与远程 API 调用，无冗余依赖（压缩后仅 68KB）。

---

## 一、安装方式
| 安装类型 | 命令/操作 | 适用场景 |
| :--- | :--- | :--- |
| npm 安装 | `npm i @multiavatar/multiavatar` | 前端工程化项目（CommonJS/ES Module） |
| CDN 引入 | `<script src="https://cdn.jsdelivr.net/npm/@multiavatar/multiavatar/multiavatar.min.js"></script>` | 静态页面、快速原型 |
| 本地脚本 | 下载 `multiavatar.min.js` 并通过 `<script>` 引入 | 离线项目、自定义部署 |

---

## 二、本地调用（核心用法）
根据项目模块规范，选择对应调用方式，核心是执行 `multiavatar()` 函数并传入**必填字符串**，返回 SVG 代码。

### 1. CommonJS 规范
```javascript
const multiavatar = require('@multiavatar/multiavatar');
const svgCode = multiavatar('你的唯一标识'); // 如用户ID、邮箱
```

### 2. ES Module 规范
```javascript
import multiavatar from '@multiavatar/multiavatar/esm';
const svgCode = multiavatar('你的唯一标识');
```

### 3. 原生 Script 标签
```javascript
<script src="multiavatar.min.js"></script>
<script>
  const svgCode = multiavatar('你的唯一标识');
  // 插入到页面
  document.getElementById('avatar-container').innerHTML = svgCode;
</script>
```

---

## 三、核心参数说明
`multiavatar(string, sansEnv, ver)` 共 3 个参数，仅 **string** 为必填。

| 参数 | 类型 | 说明 | 示例 |
| :--- | :--- | :--- | :--- |
| `string` | 字符串 | 头像唯一标识（会被转换为 6 组 00-47 数字，对应头像 6 个部件） | `'user_001'`、`'zhangsan@xxx.com'` |
| `sansEnv` | 布尔值（可选） | 是否隐藏圆形背景（环境部件），默认 `false` | `true`（无背景） |
| `ver` | 对象（可选） | 强制指定初始版本/主题 | `{part: '01', theme: 'A'}` |

**示例（带可选参数）**：
```javascript
// 无背景 + 强制指定部件与主题
const svgCode = multiavatar('test', true, {part: '01', theme: 'A'});
```

---

## 四、远程 API 调用（无需本地安装）
直接通过官方 API 获取不同格式的头像，无需引入脚本，适合跨语言项目。

| 需求 | API 地址 | 返回结果 |
| :--- | :--- | :--- |
| 获取 SVG 代码 | `https://api.multiavatar.com/唯一标识` | 纯 SVG 文本 |
| 获取 SVG 文件 | `https://api.multiavatar.com/唯一标识.svg` | SVG 二进制文件 |
| 获取 PNG 文件 | `https://api.multiavatar.com/唯一标识.png` | PNG 图片文件 |

**JavaScript 调用示例（获取 SVG 代码）**：
```javascript
fetch('https://api.multiavatar.com/Binx Bond')
  .then(res => res.text())
  .then(svg => console.log(svg));
```

---

## 五、开发与定制（进阶）
### 1. 核心原理
头像由 **6 个部件**（环境、衣物、头部、嘴、眼睛、顶部）组成，脚本通过混合不同部件与 3 种颜色主题生成新头像。

### 2. 自定义头像样式
1. 用矢量工具（如 Inkscape）编辑 `svg` 文件夹下的 `_final.svg` 文件；
2. 运行 `_build.php` 脚本，自动将新 SVG 代码更新到 `multiavatar-dev.js`；
3. 测试后压缩为 `multiavatar.min.js` 部署。

---

## 六、许可证与使用限制
可**免费商用**，需遵守仓库 `LICENSE` 中的条款，无额外付费要求。

---

## 关键使用要点
1. **唯一性保障**：同一输入字符串始终生成同一头像，适合作为用户 identicon；
2. **轻量无依赖**：仅集成 SHA-256 算法，无第三方库，加载快；
3. **多格式支持**：本地生成 SVG，API 支持 SVG/PNG 输出，适配不同场景。