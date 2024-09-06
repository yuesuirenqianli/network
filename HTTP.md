# HTTP

**HTTP(Hypertext Transfer Protocol)** 是用于传输超文本(例如HTML文档)的应用层协议。是万维网(World Wide Web)基础协议之一，定义了客户端和服务端之间的通信方式。

## HTTP Version

- **0.9**
- **1.0**
- **1.1**

## HTTP Feature

- **无状态协议**
  - **定义**: HTTP协议不维护前后请求的状态
  - **优点**: 减少了服务器的CPU和内存资源消耗，因为每个请求都是独立的

## HTTP Defect

- 明文通信
- 不验证通信方身份
- 无法证明报文完整性

## Request

- **请求方法**: 指明请求的操作类型（如GET、POST）
- **请求URI**: 请求的资源地址
- **协议版本**: HTTP版本（如HTTP/1.1）
- **请求首部字段**: 可选的请求头信息
- **实体**: 请求的主体数据（如POST请求中的数据）

## Response

- **协议版本**: HTTP版本(如HTTP/1.1)
- **状态码**: 响应状态的数字代码(如200、404)
- **状态码说明**: 对状态码的简要描述
- **响应首部字段**: 可选的响应头信息
- **实体**: 响应的主体数据(如请求的网页内容)

## Headers

- **类型**:
  - **General Header Fields**: 请求报文和响应报文两方都会使用
    - **Connection**
    - **Cache-Control**
    - **Date**
    - **Pragma**
    - **Trailer**
    - **Transfer-Encoding**
    - **Upgrade**
    - **Via**
    - **Warning**
  - **Request Header Fields**: 客户端向服务器端发送请求报文
    - **Accept**
    - **Accept-Charset**
    - **Accept-Encoding**
    - **Accept-Language**
    - **Authorization**
    - **Expect**
    - **From**
    - **Host**
    - **If-Match**
    - **If-Modified-Since**
    - **If-None-Match**
    - **If-Range**
    - **If-Unmodified-Since**
    - **Max-Forwards**
    - **Proxy-Authorization**
    - **Range**
    - **Referer**
    - **TE**
    - **User-Agent**
  - **Response Header Fields**: 服务器端向客户端返回响应报文
    - **Accept-Ranges**
    - **Age**
    - **ETag**
    - **Location**
    - **Proxy-Authenticate**
    - **Retry-After**
    - **Server**
    - **Vary**
    - **WWW-Authenticate**
  - **Entity Header Fields**: 针对请求报文和响应报文的实体部分
    - **Allow**
    - **Content-Encoding**
    - **Content-Language**
    - **Content-Length**
    - **Content-Location**
    - **Content-MD5**
    - **Content-Range**
    - **Content-Type**
    - **Expires**
    - **Last-Modified**

## Status

- **定义**: HTTP状态码表示客户端请求结果，服务器处理结果，异常信息。
- **组成**: 3位数字 和 原因短语
- **示例**: 
  - **1xx （Informational 信息性状态码）**: 接收的请求正在处理
  - **2xx （Success 成功状态码） **: 请求正常处理完毕
  - **3xx （Redirection 重定向状态码）**: 需要进行附加操作以完成请求
  - **4xx （Client Error 客户端错误状态码）**: 服务器无法处理请求
  - **5xx （Server Error 服务端错误状态码）**: 服务器处理请求出错

- **常用状态码**: 
  - **200 OK**: 
  - **204 No Content**: 
  - **206 Partial Content**: 
  - **301 Moved Permanently**: 
  - **302 Found**: 
  - **303 See Other**: 
  - **304 Not Modified**: 
  - **307 Temporary Redirect**: 
  - **400 Bad Request**: 
  - **401 Unauthorized**: 
  - **403 Forbidden**: 
  - **404 Not Found**: 
  - **500 Internal Server Error**: 
  - **503 Service Unavailable**: 


## HTTP Persistent Connections

- **定义**: 连接在一个请求/响应交换后保持打开状态，直到明确关闭

- **特点**: 

  - **keep-alive**: 只要任意一端没有明确提出断开连接，则保持TCP连接状态

  - **版本**: HTTP/1.1默认使用持久连接，减少TCP连接建立和断开的开销

- **管线化(pipelining)**
  - **定义**: 允许客户端在等待前一个请求响应时，发送多个请求
  - **优点**: 提高响应速度，减少延迟

## 提升传输速率

- **压缩**: 

  - **gzip(GNU zip)**: 常用的压缩格式，能有效减少传输数据量
  
  
    - **compress**: UNIX系统的标准压缩格式
  
    - **deflate**: zlib库的压缩格式
  
    - **identity**: 不进行编码，原始数据传输


- **分块传输编码(Chunked Transfer Coding)**: 
  - **定义**: 将大容量数据分割成块，每块用十六进制表示大小
  - **终止标记**: 最后一块用“0(CR+LF)”标记
  - **优点**: 适用于动态生成内容的响应

## Multipart(多部分对象集合)

- **定义**:  请求或响应报文主体中包含多类型实体

- **常见类型**: 
  - **multipart/form-data**: 用于Web表单文件上传

  - **multipart/byteranges**: 用于状态码206(部分内容)的响应，包含多个数据范围


## Range Request

- **定义**: 允许客户端请求服务器只传输特定范围的数据，而不是整个资源

- **用途**: 

  - **断点续传**: 如果客户端下载文件过程中中断，使用 Range Request 可以从中断的地方继续下载，而不必重新开始
  - **按需加载**: 客户端可以根据需要请求文件的某些部分（如视频流的某个时间段），从而优化资源的加载效率
  - **大文件处理**: 对于非常大的文件，客户端可以分批次请求文件的不同部分，避免一次性加载所有内容，降低内存和网络的压力

- **原理**: 

  - **请求头**: 客户端在请求头中使用 `Range` 字段指定所需的数据范围。格式通常为 `bytes=start-end`，表示请求数据的字节范围。例如: 

    ```bash
    Range: bytes=0-499
    ```

    该请求要求服务器返回从字节 0 到 499 的数据

- **响应**: 

  - **状态码**: 对于成功的范围请求，服务器会返回状态码 `206 Partial Content`，并提供所请求的内容部分

  - **单一范围请求**: 
  
    - **`Content-Range`** 字段标明返回的数据范围和文件总长度

  - **多重范围请求**: 
  
    - **`Content-Type`** 设为 `multipart/byteranges`，并使用边界字符串 (`BoundaryString`) 分隔不同的内容部分
  
  - **无法处理范围请求**: 
  
    - 如果服务器不支持范围请求或无法处理指定的范围，将返回完整的资源内容。
  

## Content Negotiation

- **定义**: 动态提供符合客户端需要的资源内容
- **类型**: 
  - **服务器驱动协商(Server-driven Negotiation)**: 服务器根据客户端请求信息自动选择合适内容
  - **客户端驱动协商(Agent-driven Negotiation)**: 服务器提供所有选项，客户端自助选择合适的内容
  - **透明协商(Transparent Negotiation)**: 客户端和服务器共同参与，由代理服务器在两者之间协调
