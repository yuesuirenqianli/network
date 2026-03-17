import Router from "@koa/router";
import sessionRouter from "./session.mjs";

const router = new Router({ prefix: "/api" });

router.use(sessionRouter.routes(), sessionRouter.allowedMethods());

export default router;
