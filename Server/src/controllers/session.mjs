import { HttpStatus } from "../constants/enums.mjs";
import { User } from "../models/user.mjs";
import {
  BadRequestException,
  UnauthorizedException,
} from "../utils/exceptions.mjs";
import { success } from "../utils/response.mjs";

export const createSession = async (ctx) => {
  const { email = "", password = "" } = ctx.request.body;

  if (!email || !password) {
    throw new BadRequestException("Email and password are required");
  }

  const user = await User.findOne({
    where: { email },
  });

  if (user !== null && user.password === password) {
    // 为了安全起见，不要把密码返回给前端
    const { password: _, ...userInfo } = user.toJSON();

    // 设置 HttpOnly 的 Cookie 进行会话状态保持
    ctx.cookies.set("sessionId", user.id.toString(), {
      httpOnly: true, // 仅允许服务端访问，防止 XSS 攻击窃取
      maxAge: 1000 * 60 * 60 * 24 * 7, // 有效期 7 天
      overwrite: true, // 如果已有同名 Cookie 则覆盖
    });

    return success(ctx, userInfo, "登录成功", HttpStatus.CREATED); // 201 Created
  } else {
    throw new UnauthorizedException("登录失败，账号或密码错误");
  }
};

export const deleteSession = async (ctx) => {
  // 登出时清除 Cookie
  ctx.cookies.set("sessionId", "", {
    maxAge: 0,
    overwrite: true,
  });

  return success(ctx, null, "登出成功", HttpStatus.NO_CONTENT); // 204 No Content
};

export const getSession = async (ctx) => {
  const sessionId = ctx.cookies.get("sessionId");

  if (!sessionId) {
    throw new UnauthorizedException("未登录或会话已过期");
  }

  const user = await User.findByPk(sessionId);

  if (!user) {
    throw new UnauthorizedException("用户不存在或已删除");
  }

  const { password: _, ...userInfo } = user.toJSON();
  return success(ctx, userInfo, "获取会话成功", HttpStatus.OK);
};
