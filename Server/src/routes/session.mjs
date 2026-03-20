import Router from "@koa/router";
import { z } from "zod";
import {
  createSession,
  deleteSession,
  getSession,
} from "../controllers/session.mjs";
import { requireAuth } from "../middlewares/auth.mjs";
import { validate } from "../middlewares/validation.mjs";

const router = new Router();

const loginSchema = {
  body: z.object({
    email: z
      .string()
      .email("必须是有效的邮箱格式")
      .max(100, "邮箱长度不能超过100"),
    password: z.string().min(1, "密码不能为空").max(100, "密码长度不能超过100"),
  }),
};

router.post("/sessions", validate(loginSchema), createSession);
router.put("/sessions", requireAuth, async (ctx) => {
  ctx.body = { message: "PUT 请求已成功处理", data: ctx.request.body };
});
router.get("/sessions/current", requireAuth, getSession);
router.delete("/sessions/current", requireAuth, deleteSession);

export default router;
