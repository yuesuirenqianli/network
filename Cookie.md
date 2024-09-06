## Cookie

**Purpose **: 解决无状态协议下的身份识别和登录认证问题

**Principle**: 

    1. **服务器设置Cookie**: 服务器通过`Set-Cookie`首部字段向客户端发送Cookie
    2. **客户端保存Cookie**: 客户端接收到`Set-Cookie`字段后，保存Cookie
    3. **客户端发送Cookie**: 下次请求时，客户端会将保存的Cookie值自动加入到请求报文中
    4. **服务器处理Cookie**: 服务器收到Cookie后检查并匹配客户端的状态信息
