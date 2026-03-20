import { BadRequestException } from "../utils/exceptions.mjs";

export const validate = (schema) => {
  return async (ctx, next) => {
    try {
      // 解析 body
      if (schema.body) {
        ctx.request.body = schema.body.parse(ctx.request.body);
      }
      // 解析 query
      if (schema.query) {
        ctx.query = schema.query.parse(ctx.query);
      }
      // 解析 params
      if (schema.params) {
        ctx.params = schema.params.parse(ctx.params);
      }
      await next();
    } catch (error) {
      // 处理 Zod 验证错误
      if (error.name === "ZodError") {
        const errors = error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));
        throw new BadRequestException("参数验证失败: " + JSON.stringify(errors));
      }
      throw error;
    }
  };
};
