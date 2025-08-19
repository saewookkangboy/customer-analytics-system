import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import dotenv from 'dotenv';
import { rateLimit } from 'express-rate-limit';
import { errorHandler, notFoundHandler, requestLogger, rateLimiter } from './middleware/errorHandler';

// 환경 변수 로드
dotenv.config();

// 라우터 임포트
import scenarioRoutes from './routes/scenarioRoutes';
import kpiRoutes from './routes/kpiRoutes';
import eventRoutes from './routes/eventRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import authRoutes from './routes/authRoutes';
import settingRoutes from './routes/settingRoutes';

const app = express();
const PORT = process.env.PORT || 3001;

// 보안 미들웨어
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['http://localhost:8100'] 
    : ['http://localhost:8100', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// 압축 미들웨어
app.use(compression());

// 요청 로깅 미들웨어
app.use(requestLogger);

// 로깅 미들웨어
app.use(morgan('combined'));

// 요청 제한 (개발 환경에서는 더 관대하게 설정)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15분
  max: process.env.NODE_ENV === 'production' ? 100 : 1000, // 개발 환경에서는 더 많은 요청 허용
  message: {
    error: 'Too many requests. Please try again later.',
    message: '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // 헬스체크와 정적 파일은 제한에서 제외
    return req.path === '/health' || req.path === '/api/health' || req.path.startsWith('/static/');
  }
});
app.use('/api/', limiter);

// 개발 환경에서는 추가 rate limiter 비활성화
if (process.env.NODE_ENV === 'production') {
  app.use('/api/', rateLimiter(50, 60000)); // 1분당 50개 요청
}

// JSON 파싱
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// JSON 파싱 오류 처리 미들웨어
app.use((error: any, req: any, res: any, next: any) => {
  if (error instanceof SyntaxError && 'body' in error) {
    return res.status(400).json({
      success: false,
      error: 'Invalid JSON format',
      timestamp: new Date()
    });
  }
  next();
});

// 헬스 체크 엔드포인트
app.get('/health', async (req, res) => {
  try {
    const healthCheck = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0',
      services: {
        database: 'mock',
        api: 'running'
      },
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024)
      }
    };

    res.status(200).json(healthCheck);
  } catch (error) {
    const errorResponse = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      uptime: process.uptime()
    };

    res.status(503).json(errorResponse);
  }
});

// API 헬스 체크 엔드포인트
app.get('/api/health', async (req, res) => {
  try {
    const healthCheck = {
      success: true,
      data: {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
      },
      timestamp: new Date()
    };

    res.status(200).json(healthCheck);
  } catch (error) {
    const errorResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date()
    };

    res.status(503).json(errorResponse);
  }
});

// API 라우트
app.use('/api/scenarios', scenarioRoutes);
app.use('/api/kpi', kpiRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/settings', settingRoutes);

// 루트 엔드포인트
app.get('/', (req, res) => {
  res.json({
    message: '고객 행동 데이터 분석 시스템 API',
    version: '1.0.0',
    endpoints: {
      scenarios: '/api/scenarios',
      kpi: '/api/kpi',
      events: '/api/events',
      dashboard: '/api/dashboard',
      auth: '/api/auth',
      settings: '/api/settings'
    }
  });
});

// 404 핸들러
app.use('*', notFoundHandler);

// 전역 에러 핸들러
app.use(errorHandler);

// 서버 시작
let server: any;

const startServer = async () => {
  try {
    console.log('✅ 모의 데이터로 서버 실행');
    
    server = app.listen(PORT, () => {
      console.log(`🚀 서버가 포트 ${PORT}에서 실행 중입니다.`);
      console.log(`📊 API 문서: http://localhost:${PORT}`);
      console.log(`🔗 프론트엔드: http://localhost:8100`);
    });
  } catch (error) {
    console.error('서버 시작 실패:', error);
    process.exit(1);
  }
};

// 프로세스 모니터링
let isShuttingDown = false;

const gracefulShutdown = (signal: string) => {
  if (isShuttingDown) {
    console.log('이미 종료 프로세스가 진행 중입니다.');
    return;
  }
  
  isShuttingDown = true;
  console.log(`${signal} 신호를 받았습니다. 서버를 안전하게 종료합니다...`);
  
  // 30초 후 강제 종료
  setTimeout(() => {
    console.error('강제 종료를 실행합니다.');
    process.exit(1);
  }, 30000);
  
  // 서버 종료
  if (server) {
    server.close(() => {
      console.log('서버가 안전하게 종료되었습니다.');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

// 프로세스 종료 처리
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// 예상치 못한 오류 처리
process.on('uncaughtException', (error) => {
  console.error('예상치 못한 오류가 발생했습니다:', error);
  gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('처리되지 않은 Promise 거부:', reason);
  gracefulShutdown('unhandledRejection');
});

startServer(); 