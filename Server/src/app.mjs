import bodyparser from "@koa/bodyparser";
import cors from "@koa/cors";
import Koa from "koa";

import { connectDB } from "./config/database.mjs";
import { errorHandler } from "./middlewares/errorHandler.mjs";
import router from "./routes/index.mjs";

(async () => {
  // 1. 初始化数据库连接
  await connectDB();

  // 2. 初始化 Koa 实例
  const app = new Koa();

  // 3. 注册全局中间件
  app.use(errorHandler); // 异常捕获 (必须放在最前面)
  app.use(
    cors({
      origin: (ctx) => {
        const origin = ctx.request.header.origin;
        if (process.env.NODE_ENV === "production") {
          // 生产环境使用白名单验证
          const allowedOrigins = process.env.ALLOWED_ORIGINS
            ? process.env.ALLOWED_ORIGINS.split(",")
            : [];
          if (allowedOrigins.includes(origin)) {
            return origin;
          }
          return false; // 拒绝跨域
        }
        // 开发环境为了方便动态返回请求的 Origin
        return origin || "*";
      },
      credentials: true, // 允许跨域携带 Cookie
      allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // 允许的跨域请求方法
      allowHeaders: [
        "Content-Type",
        "Authorization",
        "Accept",
        "X-Custom-Header",
      ], // 允许的自定义请求头
    }),
  ); // 处理跨域
  app.use(bodyparser()); // 解析 application/json

  // 4. 注册路由
  app.use(router.routes());
  app.use(router.allowedMethods());

  // 5. 启动服务
  const PORT = 9001;
  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
})();
