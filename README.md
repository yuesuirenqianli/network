# 计算机网络与 Web 通信指南

本项目旨在系统性地梳理计算机网络中与 Web 开发息息相关的核心协议与技术体系。整体知识脉络按照**自顶向下（从应用层到网络基础设施）**的逻辑进行组织。

## 目录导读

### 一、 核心应用层协议 (Application Layer)

日常接触最多、最直接交互的网络层次。

- **[HTTP (超文本传输协议)](./docs/HTTP.md)**
  - Web 通信的基石。介绍了 HTTP 的无状态特性、请求/响应报文结构、常用状态码及核心工作流程。
- **[HTTP 版本演进](./docs/HTTP-Versions.md)**
  - 讲述从 HTTP/0.9 到 HTTP/3.0 的演进历程，重点解析了持久连接、管道化、多路复用以及各版本试图解决的核心痛点（如队头阻塞）。
- **[HTTPS (安全超文本传输协议)](./docs/HTTPS.md)**
  - 在 HTTP 基础之上加入 SSL/TLS 层，解决了明文传输带来的窃听、篡改和伪装风险。重点解析了 TLS 握手流程。

### 二、 Web 安全与状态管理 (Security & State)

HTTP 本身是无状态且明文的，这部分探讨了如何在应用层弥补这些缺陷。

- **[Cookie 与状态保持](./docs/Cookie.md)**
  - 解决 HTTP 无状态问题的经典方案，介绍了 Cookie 的核心属性、工作流程及其与 Session/Token 的对比。
- **[Cryptography (密码学基础)](./docs/Cryptography.md)**
  - HTTPS 的底层基石。涵盖了对称加密、非对称加密、哈希算法，以及现代网络中广泛使用的“混合加密”机制。

### 三、 Web 基础设施 (Infrastructure)

协议需要具体的物理或软件载体来运行，这部分介绍了支撑 Web 运行的核心组件。

- **[Web 服务器 (Web Server)](./docs/WebServer.md)**
  - 解析了 Web 服务器的核心能力（虚拟主机、代理、网关、隧道、缓存），以及 Nginx 等反向代理服务器的工作流。
- **[SQLite 嵌入式数据库](./docs/SQLite.md)**
  - 介绍了无服务器、单文件存储的轻量级数据库原理。解析了它与传统 MySQL 等 C/S 架构数据库的区别及其技术权衡。

### 四、 底层网络基石 (Transport & Network Layer)

应用层的一切魔法，都建立在可靠的底层网络协议之上。

- **[TCP/IP 协议族](./docs/TCP-IP.md)**
  - 互联网的绝对骨干。介绍了四层/七层网络模型、数据从应用层到物理层的封装/解封装过程，以及 TCP 核心的三次握手机制。

---

## 项目实践 (Project Practice)

理论需要结合实践。本项目提供了一个简单的客户端与服务端前后端分离的登录交互示例，用于演示和验证网络请求的真实流程。

### [Client (前端客户端)](./Client/)

- 一个原生的 HTML/JS 页面（集成 Bootstrap）。
- 演示了如何通过 `fetch` API 发起 `POST` 请求。
- 演示了如何设置 `Content-Type: application/json` 请求头并携带 JSON 数据。

### [Server (后端服务端)](./Server/)

- 基于 Node.js + Koa 框架构建的轻量级 Web 服务器。
- 演示了如何通过 `@koa/cors` 解决**跨域资源共享 (CORS)** 问题。
- 演示了如何解析请求体 (`@koa/bodyparser`)，并连接 SQLite 数据库 (`sequelize`) 验证用户账密。
- 提供了一个标准的 `/api/signin` 接口，返回结构化的 HTTP 响应状态和 JSON 数据。
