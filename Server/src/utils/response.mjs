import { BusinessCode, HttpStatus } from "../constants/enums.mjs";

export const success = (
  ctx,
  data = null,
  message = "success",
  status = HttpStatus.OK,
) => {
  ctx.status = status;
  ctx.body = {
    code: status,
    bizCode: BusinessCode.SUCCESS,
    result: data,
    message,
    timestamp: new Date().toISOString(),
  };
};

// error 方法其实主要保留给不需要抛出异常，只是想返回错误状态的场景
// 推荐优先使用 throw new XXXException()
export const error = (
  ctx,
  message = "error",
  status = HttpStatus.BAD_REQUEST,
  bizCode = BusinessCode.COMMON_ERROR,
) => {
  ctx.status = status;
  ctx.body = {
    code: status,
    bizCode: bizCode,
    result: null,
    message,
    timestamp: new Date().toISOString(),
  };
};
