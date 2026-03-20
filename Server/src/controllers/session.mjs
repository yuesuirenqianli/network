import { HttpStatus } from "../constants/enums.mjs";
import { loginUser } from "../services/session.mjs";
import { success } from "../utils/response.mjs";

export const createSession = async (ctx) => {
  const { email, password } = ctx.request.body;

  // 调用 Service 层处理业务逻辑
  const { user, token } = await loginUser(email, password);

  // 设置 HttpOnly 的 Cookie 进行会话状态保持
  ctx.cookies.set("token", token, {
    httpOnly: true, // 仅允许服务端访问，防止 XSS 攻击窃取
    maxAge: 1000 * 60 * 60 * 24 * 7, // 有效期 7 天
    overwrite: true, // 如果已有同名 Cookie 则覆盖
    sameSite: "lax", // 防止 CSRF 攻击
  });

  return success(ctx, user, "登录成功", HttpStatus.CREATED); // 201 Created
};

export const deleteSession = async (ctx) => {
  // 登出时清除 Cookie
  ctx.cookies.set("token", "", {
    maxAge: 0,
    overwrite: true,
  });

  return success(ctx, null, "登出成功", HttpStatus.NO_CONTENT); // 204 No Content
};

export const getSession = async (ctx) => {
  // authMiddleware 已经将 user 挂载到 ctx.state.user 上
  const user = ctx.state.user;
  return success(ctx, user, "获取会话成功", HttpStatus.OK);
};
