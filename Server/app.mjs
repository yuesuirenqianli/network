import Koa from "koa";
import bodyparser from "@koa/bodyparser";
import Router from "@koa/router";
import cors from "@koa/cors";
import { User, sequelize } from "./orm.mjs";

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }

  const app = new Koa();
  const router = new Router();

  app.use(bodyparser());

  router.post("/api/signin", async (ctx) => {
    const { email = "", password = "" } = ctx.request.body;
    const user = await User.findOne({
      where: {
        email,
      },
    });
    if (user !== null && user.password === password) {
      ctx.body = {
        code: 200,
        result: user,
        message: '登录成功'
      };
    } else {
      ctx.body = {
        code: 401,
        result: null,
        message: "登录失败"
      };
    }
  });

  app.use(cors());
  app.use(router.routes());
  app.use(router.allowedMethods());

  app.listen(9001, () => {
    console.log("app started at port: 9001...");
  });
})();
