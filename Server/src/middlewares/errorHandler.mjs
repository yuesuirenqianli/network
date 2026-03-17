import { HttpStatus, BusinessCode } from "../constants/enums.mjs";
import { BaseException } from "../utils/exceptions.mjs";

/**
 * 全局异常捕获中间件
 */
export const errorHandler = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    // 1. 如果是已知业务异常
    if (err instanceof BaseException) {
      ctx.status = err.httpStatus;
      ctx.body = {
        code: err.httpStatus, // HTTP 状态码
        bizCode: err.businessCode, // 业务错误码
        message: err.message,
        timestamp: new Date().toISOString(),
      };
      return;
    }

    // 2. 如果是未知的系统异常
    console.error("Unhandled Error:", err);
    ctx.status = HttpStatus.INTERNAL_SERVER_ERROR;
    ctx.body = {
      code: HttpStatus.INTERNAL_SERVER_ERROR,
      bizCode: BusinessCode.COMMON_ERROR,
      message: "Internal Server Error",
      // 开发环境下可以返回堆栈信息方便调试
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
      timestamp: new Date().toISOString(),
    };
  }
};
