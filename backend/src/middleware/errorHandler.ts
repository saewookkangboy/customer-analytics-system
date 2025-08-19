import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
  code?: string | number;
}

export class CustomError extends Error implements AppError {
  public statusCode: number;
  public isOperational: boolean;
  public code?: string | number;

  constructor(message: string, statusCode: number = 500, code?: string | number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    if (code !== undefined) {
      this.code = code;
    }

    Error.captureStackTrace(this, this.constructor);
  }
}

// 요청 ID 생성 함수
const generateRequestId = (): string => {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// 요청 로깅 미들웨어
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const requestId = generateRequestId();
  req.headers['x-request-id'] = requestId;
  
  const startTime = Date.now();
  
  // 응답 완료 후 로깅
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const logData = {
      requestId,
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.get('User-Agent'),
      ip: req.ip || req.connection.remoteAddress,
      timestamp: new Date().toISOString()
    };
    
    if (res.statusCode >= 400) {
      console.error('Request Error:', logData);
    } else {
      console.log('Request:', logData);
    }
  });
  
  next();
};

export const errorHandler = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let { statusCode = 500, message } = error;
  const requestId = req.headers['x-request-id'] as string;

  // 에러 로깅
  const errorLog = {
    requestId,
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    body: req.body,
    params: req.params,
    query: req.query,
    userAgent: req.get('User-Agent'),
    ip: req.ip || req.connection.remoteAddress,
    timestamp: new Date().toISOString()
  };

  // 개발 환경에서는 더 자세한 에러 정보 제공
  if (process.env.NODE_ENV === 'development') {
    console.error('Error details:', errorLog);
  } else {
    // 프로덕션 환경에서는 민감한 정보 제거
    console.error('Error:', {
      requestId,
      message: error.message,
      url: req.url,
      method: req.method,
      timestamp: new Date().toISOString()
    });
    
    // 프로덕션에서는 일반적인 에러 메시지
    if (statusCode === 500) {
      message = '서버 내부 오류가 발생했습니다.';
    }
  }

  // 특정 에러 타입에 따른 처리
  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = '입력 데이터가 유효하지 않습니다.';
  } else if (error.name === 'CastError') {
    statusCode = 400;
    message = '잘못된 데이터 형식입니다.';
  } else if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = '유효하지 않은 토큰입니다.';
  } else if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    message = '토큰이 만료되었습니다.';
  } else if (error.name === 'MongoError' || error.name === 'MongoServerError') {
    // MongoDB 오류 처리
    if (error.code === 11000) {
      statusCode = 409;
      message = '중복된 데이터가 존재합니다.';
    } else {
      statusCode = 500;
      message = '데이터베이스 오류가 발생했습니다.';
    }
  } else if (error.name === 'SyntaxError') {
    statusCode = 400;
    message = '잘못된 요청 형식입니다.';
  }

  const response: ApiResponse = {
    success: false,
    error: message,
    timestamp: new Date(),
    requestId
  };

  // 개발 환경에서만 스택 트레이스 포함
  if (process.env.NODE_ENV === 'development' && error.stack) {
    (response as any).stack = error.stack;
  }

  res.status(statusCode).json(response);
};

export const notFoundHandler = (req: Request, res: Response): void => {
  const requestId = req.headers['x-request-id'] as string;
  
  const response: ApiResponse = {
    success: false,
    error: `요청한 엔드포인트를 찾을 수 없습니다: ${req.method} ${req.originalUrl}`,
    timestamp: new Date(),
    requestId
  };

  res.status(404).json(response);
};

// 비동기 함수 래퍼
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// 요청 유효성 검사 미들웨어
export const validateRequest = (schema?: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!schema) {
      return next();
    }

    try {
      const { error } = schema.validate(req.body);
      if (error) {
        throw new CustomError(error.details[0].message, 400, 'VALIDATION_ERROR');
      }
      next();
    } catch (err) {
      next(err);
    }
  };
};

// 요청 속도 제한 미들웨어 (간단한 구현)
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export const rateLimiter = (maxRequests: number = 100, windowMs: number = 60000) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    const now = Date.now();
    
    const userRequests = requestCounts.get(ip);
    
    if (!userRequests || now > userRequests.resetTime) {
      requestCounts.set(ip, { count: 1, resetTime: now + windowMs });
    } else {
      userRequests.count++;
      
      if (userRequests.count > maxRequests) {
        const response: ApiResponse = {
          success: false,
          error: 'Rate limit exceeded. Please try again later.',
          timestamp: new Date()
        };
        res.status(429).json(response);
        return;
      }
    }
    
    next();
  };
}; 