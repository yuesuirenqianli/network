import { UnauthorizedException } from "../utils/exceptions.mjs";
import { verifySession } from "../services/session.mjs";

export const requireAuth = async (ctx, next) => {
  const token = ctx.cookies.get("token") || ctx.headers.authorization?.replace("Bearer ", "");
  
  if (!token) {
    throw new UnauthorizedException("未登录或缺少 Token");
  }

  const user = await verifySession(token);
  // 将用户信息挂载到上下文，方便后续路由使用
  ctx.state.user = user;
  
  await next();
};
