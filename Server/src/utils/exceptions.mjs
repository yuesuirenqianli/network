import { HttpStatus, BusinessCode } from "../constants/enums.mjs";

/**
 * 基础异常类
 */
export class BaseException extends Error {
  constructor(message, httpStatus, businessCode) {
    super(message);
    this.httpStatus = httpStatus;
    this.businessCode = businessCode;
    this.name = this.constructor.name;
  }
}

/**
 * 400 参数错误异常
 */
export class BadRequestException extends BaseException {
  constructor(message = "Bad Request") {
    super(message, HttpStatus.BAD_REQUEST, BusinessCode.PARAM_ERROR);
  }
}

/**
 * 401 未授权异常
 */
export class UnauthorizedException extends BaseException {
  constructor(message = "Unauthorized") {
    super(message, HttpStatus.UNAUTHORIZED, BusinessCode.AUTH_ERROR);
  }
}

/**
 * 403 禁止访问异常
 */
export class ForbiddenException extends BaseException {
  constructor(message = "Forbidden") {
    super(message, HttpStatus.FORBIDDEN, BusinessCode.AUTH_ERROR);
  }
}

/**
 * 404 资源不存在异常
 */
export class NotFoundException extends BaseException {
  constructor(message = "Not Found") {
    super(message, HttpStatus.NOT_FOUND, BusinessCode.COMMON_ERROR);
  }
}
