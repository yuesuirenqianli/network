// HTTP 状态码枚举
export const HttpStatus = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

// 业务错误码枚举
export const BusinessCode = {
  SUCCESS: 0,
  COMMON_ERROR: 1000,
  PARAM_ERROR: 1001,
  AUTH_ERROR: 1002,
  DB_ERROR: 2001,
};
