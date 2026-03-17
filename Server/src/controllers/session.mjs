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
    return success(ctx, userInfo, "登录成功", HttpStatus.CREATED); // 201 Created
  } else {
    throw new UnauthorizedException("登录失败，账号或密码错误");
  }
};
