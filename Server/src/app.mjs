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
  app.use(cors()); // 处理跨域
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
