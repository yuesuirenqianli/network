import Router from "@koa/router";
import {
  createSession,
  deleteSession,
  getSession,
} from "../controllers/session.mjs";

const router = new Router();

router.post("/sessions", createSession);
router.put("/sessions", async (ctx) => {
  ctx.body = { message: "PUT 请求已成功处理", data: ctx.request.body };
});
router.get("/sessions/current", getSession);
router.delete("/sessions/current", deleteSession);

export default router;
