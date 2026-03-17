# Server 后端服务 (RESTful API 架构)

本项目后端采用 Node.js + Koa 框架构建，旨在提供一套符合 **RESTful API** 风格的接口，以支持前端的交互和状态管理演示。

- 提供标准化、无状态的接口规范，使得前端（Client）和其他任何客户端都可以通过统一的 HTTP 方法与服务端进行数据交互。
- 演示跨域资源共享 (CORS) 的处理、请求体的解析以及轻量级数据库 (SQLite) 的交互。

## 核心原理

**核心思想 (RESTful 约束)：**

- **资源导向 (Resource-Oriented)**：URI 仅代表资源的实体（如 `/users`, `/sessions`），而不包含动词。
- **统一接口 (Uniform Interface)**：通过标准的 HTTP 方法描述对资源的操作意图：
  - `POST`：创建新资源。
  - `GET`：获取/查询资源。
  - `PUT/PATCH`：更新资源。
  - `DELETE`：删除资源。
- **状态码表意**：利用 HTTP 原生的状态码（如 `200`, `201`, `400`, `401`, `404`, `500`）来传达请求的处理结果，而非全靠响应体里的 `code` 字段。

## 结构与依赖

**技术栈组成部分：**

- **框架**：`Koa` (轻量级，基于洋葱模型的中间件架构)
- **路由**：`@koa/router` (处理 RESTful 路由映射)
- **跨域**：`@koa/cors` (处理预检请求 OPTIONS 和跨域响应头)
- **参数解析**：`@koa/bodyparser` (解析 JSON 格式的请求体)
- **ORM 与数据库**：`Sequelize` + `SQLite` (本地文件型数据库，无需额外安装)

```bash
Server/
├── package.json          # 项目依赖和脚本
├── Dockerfile            # 容器化部署配置
├── README_SERVER.md      # 服务端说明文档
├── test.db               # SQLite 数据库文件 (通常建议放入 /data 目录并在 git 中 ignore)
└── src/                  # 源代码根目录
    ├── app.mjs           # 应用入口文件：负责初始化中间件、挂载路由、启动服务
    │
    ├── config/           # 【配置层】
    │   └── database.mjs  # 数据库连接配置、环境变量读取等
    │
    ├── models/           # 【数据模型层 (M)】
    │   ├── index.mjs     # 负责 Sequelize 实例初始化和关联关系建立
    │   └── user.mjs      # User 表的 Schema 定义
    │
    ├── controllers/      # 【控制层 (C)】
    │   └── session.mjs   # 处理登录/登出的核心业务逻辑 (接收 req，返回 res)
    │
    ├── routes/           # 【路由层】
    │   ├── index.mjs     # 路由统一出口，汇总所有子路由
    │   └── session.mjs   # 会话相关的路由定义 (如 POST /api/sessions)
    │
    ├── middlewares/      # 【中间件层】
    │   ├── errorHandler.mjs # 全局错误捕获中间件
    │   └── auth.mjs      # 身份验证/鉴权中间件 (如验证 Cookie/Token)
    │
    └── utils/            # 【工具层】
        └── response.mjs  # 统一的响应格式封装 (格式化 200/400/500 返回结构)
```

## RESTful API 设计

当前项目提供的核心接口设计如下（以“会话/登录”资源为例）：

### 1. 创建会话 (用户登录)

- **URL**: `/api/sessions` _(注：RESTful 风格中，登录通常被视为"创建一个 Session")_
- **Method**: `POST`
- **Content-Type**: `application/json`
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "your_password"
  }
  ```
- **Response**:
  - `201 Created`：登录成功，返回用户信息或 Token。
  - `401 Unauthorized`：登录失败（账密错误）。
  - `400 Bad Request`：参数缺失或格式错误。

### 2. 获取当前会话 (获取当前登录用户) _(实验扩展)_

- **URL**: `/api/sessions/current`
- **Method**: `GET`
- **Response**:
  - `200 OK`：返回当前用户的 Profile 数据。
  - `401 Unauthorized`：未登录或 Cookie/Token 失效。

### 3. 删除会话 (用户登出) _(实验扩展)_

- **URL**: `/api/sessions/current`
- **Method**: `DELETE`
- **Response**:
  - `204 No Content`：登出成功，清除服务端的 Session/Cookie 状态。

## 工作流程

**服务端处理请求生命周期（洋葱模型）：**

1. **CORS 中间件**：拦截所有请求，如果是 `OPTIONS` 预检请求则直接返回允许跨域的 Headers；否则给响应附加上允许跨域的标记。
2. **BodyParser 中间件**：读取 HTTP 报文流，将其转化为 JS 对象并挂载到 `ctx.request.body`。
3. **Router 中间件**：根据请求的 Method 和 URI 匹配对应的路由处理函数。
4. **业务逻辑层 (Controller)**：
   - 提取参数并进行校验。
   - 调用 ORM 层查询 SQLite 数据库（如 `User.findOne`）。
   - 根据验证结果，设置 `ctx.status` (HTTP 状态码) 和 `ctx.body` (JSON 响应数据)。
5. **响应返回**：沿洋葱模型向外穿透，最终将数据转化为 HTTP 响应报文发送给客户端。

## 关联知识

**与其他技术的联系：**

- **HTTP 协议**：RESTful 的核心在于彻底榨干 HTTP 协议本身的设计语义（Method + Status Code）。
- **CORS (跨域资源共享)**：由于前后端分离，前端通过 Fetch 调用 API 时，必须依赖后端配置 `Access-Control-Allow-Origin`。
- **Cookie / JWT**：RESTful API 本身是无状态的，为了实现“会话管理”，通常需要在 HTTP Header 中配合传输 Cookie 或 Authorization Token。
