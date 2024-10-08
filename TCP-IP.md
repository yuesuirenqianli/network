# TCP/IP协议

## 基础概念

**协议**: 管理计算机网络设备相互通信的规则和标准称之为协议(Protocol)。例如: 如何建立通信，如何解析数据，如何关闭通信等等

**TCP/IP协议**(TCP/IP Protocol Suite)是一组用于网络通信的协议，以TCP(传输控制协议)和IP(互联网协议)为核心。TCP/IP协议定义了数据从源设备到目标设备的传输方式，并涵盖了从网络底层的物理连接到应用层的各种通信协议

## 分层管理

- **应用层**
  - 直接与用户交互，提供具体的应用服务。
    - **FTP(File Transfer Protocol，文件传输协议)**
    - **DNS(Domain Name System，域名系统)**
    - **HTTP协议**
    - **DNS(Domain Name System)服务**
- **传输层**
  - 处理数据传输的可靠性。
    - **TCP(Transmission Control Protocol，传输控制协议)**
    - **UDP(User Data Protocol，用户数据报协议)**
- **网络层**
  - 负责数据包的路由和转发。决定数据包的路径，处理数据包的发送和接收
  
- **链路层**
  - 处理网络硬件通信

## 数据流动

网络通信时会通过分层顺序与对方进行通信。**发送端从应用层往下走，接收端则往应用层往上走**。发送端在层与层之间传输数据时，每经过一层时必定会被打上一个该层所属的首部信息。反之，接收端在层与层传输数据时，每经过一层时会把对应的首部消去

- **发送端**: 
  1. **应用层**: 生成数据，添加应用层协议头
  2. **传输层**: 数据分段添加TCP或者UDP头
  3. **网络层**: 数据包添加IP头，进行路由
  4. **链路层**: 添加链路层头，并将数据发送到物理网络
- **接收端**: 
  1. **链路层**: 接收数据，去除链路层头
  2. **网络层**: 去除IP头，检测数据包的路由信息
  3. **传输层**: 重新组装数据段，去除传输层头
  4. **应用层**: 处理最终的数据内容

## 核心协议

### IP(Internet Protocol)协议

- **IP地址**: 唯一标识网络中的每个设备，便于数据的正确传送
- **MAC地址**: 硬件地址，用于局域网中的设备识别
- **ARP协议(Address Resolution Protocol)**: 将IP地址转换为MAC地址，帮助在局域网中定位设备

### TCP协议

- **字节流服务(Byte Stream Service)**: 将应用层数据分割成适合传输的小段，并在传输过程中进行管理
- **三次握手**: 
  - 发送SYN数据包，发起连接
  - 接收SYN/ACK数据包，确认连接
  - 发送ACK数据包，完成握手

### DNS(Domain Name System)

将易于记忆的域名转换为机器能够理解的IP地址，或从IP地址查找域名

## 综合流程

**输入URL**: 用户在浏览器中输入URL。

**DNS解析**: 将URL中的域名解析为IP地址。

**HTTP请求**: 浏览器通过HTTP协议生成请求报文。

**数据传输**: 

- **TCP**: 将请求报文切分、传输。
- **IP**: 通过路由器进行数据包的传送。

**数据重组**: 接收端通过TCP重组报文，HTTP处理请求。
