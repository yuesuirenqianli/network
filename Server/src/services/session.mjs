import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.mjs";
import { UnauthorizedException } from "../utils/exceptions.mjs";
import { config } from "../config/env.mjs";

export const loginUser = async (email, password) => {
  const user = await User.findOne({ where: { email } });

  // 假设这里如果系统初始化，密码没被 bcrypt 加密，为了向下兼容可以做个简单判断（生产环境建议跑脚本洗数据）
  // 为了演示 bcrypt，我们假设数据库里已经是 hash 过的密码了。如果这里需要兼容明文可以特殊处理，我们这里直接用 bcrypt.compare
  if (!user) {
    throw new UnauthorizedException("登录失败，账号或密码错误");
  }

  let isMatch = false;
  // 临时兼容明文密码 (为了项目原本跑得通，生产环境去掉这段)
  if (!user.password.startsWith("$2a$") && !user.password.startsWith("$2b$")) {
    isMatch = user.password === password;
    if (isMatch) {
      // 可以在这里静默升级密码，这里仅演示
      // user.password = await bcrypt.hash(password, 10);
      // await user.save();
    }
  } else {
    isMatch = await bcrypt.compare(password, user.password);
  }

  if (!isMatch) {
    throw new UnauthorizedException("登录失败，账号或密码错误");
  }

  const { password: _, ...userInfo } = user.toJSON();

  const token = jwt.sign({ id: user.id }, config.jwtSecret, {
    expiresIn: "7d",
  });

  return { user: userInfo, token };
};

export const verifySession = async (token) => {
  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      throw new UnauthorizedException("用户不存在或已删除");
    }

    const { password: _, ...userInfo } = user.toJSON();
    return userInfo;
  } catch (err) {
    throw new UnauthorizedException("无效的会话或会话已过期");
  }
};
