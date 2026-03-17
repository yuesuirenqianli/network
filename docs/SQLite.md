# SQLite

## 本质问题

**解决什么问题：**
传统的关联型数据库（如 MySQL、PostgreSQL、Oracle）通常采用 C/S（客户端/服务端）架构，需要独立的服务器进程、复杂的安装配置和持续的运维管理。
SQLite 解决的核心问题是：如何提供一个**无需配置、无需独立服务器进程、完全基于本地文件**且支持完整 SQL 标准的轻量级关系型数据库。它让应用程序能够以极低的成本将数据持久化到本地。

## 核心原理

**核心思想：**
- **嵌入式设计**：SQLite 不是一个独立的进程，而是一个 C 语言库。它直接被链接到应用程序中，和应用程序运行在同一个进程空间。
- **单文件存储**：整个数据库（包括所有的表、索引、触发器和视图）都被打包存储在宿主机上的**一个普通的磁盘文件**中（例如本项目的 `test.db`）。
- **无服务器 (Serverless)**：不需要像 MySQL 那样启动一个 daemon 进程来监听端口接收 SQL 命令，应用程序直接通过文件 I/O 来读写数据库文件。

## 结构

**组成部分：**
- **接口层 (Interface)**：应用程序通过 API（如 Node.js 中的 `sqlite3` 驱动或 Sequelize ORM）与 SQLite 交互。
- **SQL 编译器 (SQL Compiler)**：包含分词器、解析器和代码生成器，负责将 SQL 文本编译成内部的字节码。
- **核心引擎 (Core)**：包含虚拟机（执行字节码），B-Tree（管理表和索引结构），以及 Pager（页面缓存管理，负责事务和 ACID 特性）。
- **操作系统接口 (OS Interface / VFS)**：虚拟文件系统层，屏蔽底层不同操作系统（Windows, Linux, macOS）的文件锁和 I/O 差异。

## 工作流程

**运行过程（以本项目登录查询为例）：**
1. **建立连接**：Node.js 中的 Sequelize 指定方言为 `sqlite`，并传入文件路径 `test.db`。SQLite 引擎获取该文件的读写权限（文件锁）。
2. **提交查询**：应用程序发送 SQL 语句 `SELECT * FROM users WHERE email = '...'`。
3. **编译与执行**：SQLite 内部的编译器将 SQL 语句转化为虚拟机字节码并执行。
4. **磁盘 I/O**：虚拟机通过 B-Tree 查找索引，通过 Pager 从磁盘上的 `test.db` 文件中读取对应的数据块（Page）到内存。
5. **返回结果**：将内存中的结果集返回给应用程序进程。

## 技术权衡

**优点：**
- **零配置**：无需安装、无需配置管理员账号、无需启动服务，开箱即用。
- **极度轻量**：核心库只有几百 KB，资源占用极小，非常适合 IoT、移动端（iOS/Android 原生支持）、桌面应用及小型 Web 项目。
- **ACID 兼容**：尽管小，但它完全支持事务的原子性、一致性、隔离性和持久性。
- **备份方便**：由于只是一个文件，备份数据库就等于复制粘贴这个文件。

**缺点：**
- **并发写入弱**：SQLite 采用的是**粗粒度的文件锁**。多个进程可以同时读，但**同一时刻只能有一个进程写**。高并发写入场景下会遇到 `database is locked` 错误。
- **不支持分布式**：无法像 MySQL 那样做主从复制、读写分离和集群部署。
- **网络访问受限**：本质是本地文件操作，不适合多台服务器共享同一个 SQLite 数据库（除非通过 NFS，但极易损坏文件锁）。

## 画图解释

```mermaid
flowchart TD
    subgraph 传统 C/S 数据库架构 (如 MySQL)
        App1(Web App 1) -- TCP/IP --> MySQLServer[MySQL 服务进程]
        App2(Web App 2) -- TCP/IP --> MySQLServer
        MySQLServer --> DBFiles[(分散的数据库文件)]
    end

    subgraph 嵌入式数据库架构 (SQLite)
        App3(Node.js App)
        App3 --> SQLiteLib[SQLite 引擎库 (同进程)]
        SQLiteLib -- 文件 I/O --> SingleFile[(test.db 单文件)]
    end
```

## 关联知识

**与其他技术的联系：**
- **Sequelize / TypeORM**：现代 Web 开发通常不会直接写 SQL，而是通过这些 ORM (对象关系映射) 库来操作 SQLite，本项目正是采用了 `Sequelize`。
- **IndexedDB / WebSQL**：浏览器端的本地存储方案，其中 WebSQL 其实就是基于 SQLite 的，但已被废弃；移动端 App（如微信聊天记录）则大量使用 SQLite。
- **MySQL / PostgreSQL**：当项目从单机单体架构演进为微服务或需要高并发写入时，通常会将数据从 SQLite 迁移到这些专业的 C/S 数据库。