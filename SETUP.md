# 고객 행동 데이터 분석 시스템 설정 가이드

## 📋 목차
1. [시스템 요구사항](#시스템-요구사항)
2. [설치 및 설정](#설치-및-설정)
3. [데이터베이스 설정](#데이터베이스-설정)
4. [개발 환경 실행](#개발-환경-실행)
5. [프로덕션 배포](#프로덕션-배포)
6. [API 문서](#api-문서)
7. [고객 여정 시나리오 예시](#고객-여정-시나리오-예시)

## 🖥️ 시스템 요구사항

### 필수 소프트웨어
- **Node.js**: 18.x 이상
- **PostgreSQL**: 15.x 이상
- **Redis**: 7.x 이상
- **Docker**: 20.x 이상 (선택사항)
- **Git**: 최신 버전

### 권장 사양
- **CPU**: 4코어 이상
- **RAM**: 8GB 이상
- **Storage**: 50GB 이상 (SSD 권장)

## 🚀 설치 및 설정

### 1. 저장소 클론
```bash
git clone <repository-url>
cd customer-analytics-system
```

### 2. 환경 변수 설정
```bash
# 루트 디렉토리에 .env 파일 생성
cp .env.example .env

# 환경 변수 편집
nano .env
```

#### 환경 변수 예시
```env
# 데이터베이스 설정
DB_HOST=localhost
DB_PORT=5432
DB_NAME=customer_analytics
DB_USER=postgres
DB_PASSWORD=your_password

# Redis 설정
REDIS_HOST=localhost
REDIS_PORT=6379

# 서버 설정
NODE_ENV=development
PORT=3001

# JWT 설정
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=24h

# API 설정
API_RATE_LIMIT=100
API_RATE_LIMIT_WINDOW=900000
```

## 🗄️ 데이터베이스 설정

### PostgreSQL 설치 및 설정

#### Ubuntu/Debian
```bash
# PostgreSQL 설치
sudo apt update
sudo apt install postgresql postgresql-contrib

# PostgreSQL 서비스 시작
sudo systemctl start postgresql
sudo systemctl enable postgresql

# 데이터베이스 생성
sudo -u postgres psql
CREATE DATABASE customer_analytics;
CREATE USER analytics_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE customer_analytics TO analytics_user;
\q
```

#### macOS
```bash
# Homebrew로 PostgreSQL 설치
brew install postgresql
brew services start postgresql

# 데이터베이스 생성
createdb customer_analytics
```

### 스키마 및 샘플 데이터 적용
```bash
# 스키마 적용
psql -h localhost -U postgres -d customer_analytics -f database/schema.sql

# 샘플 데이터 적용
psql -h localhost -U postgres -d customer_analytics -f database/sample_data.sql
```

### Redis 설치 및 설정

#### Ubuntu/Debian
```bash
sudo apt install redis-server
sudo systemctl start redis-server
sudo systemctl enable redis-server
```

#### macOS
```bash
brew install redis
brew services start redis
```

## 💻 개발 환경 실행

### 1. 백엔드 설정
```bash
cd backend

# 의존성 설치
npm install

# TypeScript 빌드
npm run build

# 개발 서버 실행
npm run dev
```

### 2. 프론트엔드 설정
```bash
cd frontend

# 의존성 설치
npm install

# 개발 서버 실행 (포트 8100)
npm start
```

### 3. 서비스 접속
- **프론트엔드**: http://localhost:8100
- **백엔드 API**: http://localhost:3001
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

## 🐳 프로덕션 배포

### Docker Compose를 사용한 배포

#### 1. Docker 설치 확인
```bash
docker --version
docker-compose --version
```

#### 2. 환경 변수 설정
```bash
# 프로덕션 환경 변수 설정
cp .env.example .env.production
nano .env.production
```

#### 3. 서비스 실행
```bash
# 모든 서비스 빌드 및 실행
docker-compose -f docker/docker-compose.yml up -d

# 로그 확인
docker-compose -f docker/docker-compose.yml logs -f

# 서비스 상태 확인
docker-compose -f docker/docker-compose.yml ps
```

#### 4. 서비스 중지
```bash
docker-compose -f docker/docker-compose.yml down
```

### 개별 서비스 실행

#### 백엔드만 실행
```bash
cd backend
npm run build
npm start
```

#### 프론트엔드만 실행
```bash
cd frontend
npm run build
npx serve -s build -l 8100
```

## 📚 API 문서

### 주요 엔드포인트

#### 시나리오 관리
```
GET    /api/scenarios          # 시나리오 목록 조회
POST   /api/scenarios          # 새 시나리오 생성
GET    /api/scenarios/:id      # 시나리오 상세 조회
PUT    /api/scenarios/:id      # 시나리오 수정
DELETE /api/scenarios/:id      # 시나리오 삭제
```

#### 퍼널 분석
```
GET    /api/scenarios/:id/funnel     # 퍼널 데이터 조회
GET    /api/scenarios/:id/stats      # 성과 통계 조회
GET    /api/scenarios/:id/dropout    # 드롭아웃 분석
```

#### KPI 관리
```
GET    /api/kpi               # KPI 목록 조회
POST   /api/kpi               # 새 KPI 생성
GET    /api/kpi/:id           # KPI 상세 조회
PUT    /api/kpi/:id           # KPI 수정
DELETE /api/kpi/:id           # KPI 삭제
```

#### 이벤트 추적
```
POST   /api/events/track      # 이벤트 추적
GET    /api/events            # 이벤트 목록 조회
GET    /api/events/recent     # 최근 이벤트 조회
```

### API 응답 형식
```json
{
  "success": true,
  "data": {},
  "message": "성공적으로 처리되었습니다.",
  "timestamp": "2024-01-05T10:30:00Z"
}
```

## 🎯 고객 여정 시나리오 예시

### 1. 신규 사용자 온보딩
```
목표: 신규 사용자 전환율 15% 달성
단계:
1. 홈페이지 방문
2. 상품 카테고리 탐색
3. 상품 상세 페이지
4. 장바구니 추가
5. 회원가입
6. 결제 페이지
7. 결제 완료
```

### 2. 기존 사용자 재구매
```
목표: 재구매율 25% 달성
단계:
1. 로그인
2. 상품 추천 페이지
3. 상품 검색
4. 상품 비교
5. 장바구니 추가
6. 결제 완료
```

### 3. 고객 서비스 문의
```
목표: 고객 만족도 90% 달성
단계:
1. 고객센터 접속
2. FAQ 검색
3. 문의 접수
4. 상담 진행
5. 해결 완료
6. 만족도 조사
```

## 🔧 문제 해결

### 일반적인 문제들

#### 1. 데이터베이스 연결 오류
```bash
# PostgreSQL 서비스 상태 확인
sudo systemctl status postgresql

# 연결 테스트
psql -h localhost -U postgres -d customer_analytics
```

#### 2. Redis 연결 오류
```bash
# Redis 서비스 상태 확인
sudo systemctl status redis-server

# 연결 테스트
redis-cli ping
```

#### 3. 포트 충돌
```bash
# 포트 사용 확인
netstat -tulpn | grep :8100
netstat -tulpn | grep :3001

# 프로세스 종료
kill -9 <PID>
```

#### 4. Docker 컨테이너 문제
```bash
# 컨테이너 로그 확인
docker logs <container_name>

# 컨테이너 재시작
docker restart <container_name>

# 볼륨 정리
docker volume prune
```

## 📞 지원

### 로그 확인
```bash
# 백엔드 로그
cd backend && npm run logs

# 프론트엔드 로그
cd frontend && npm run logs

# Docker 로그
docker-compose logs -f
```

### 성능 모니터링
```bash
# 시스템 리소스 확인
htop
df -h
free -h

# 네트워크 연결 확인
netstat -i
```

## 🔄 업데이트

### 코드 업데이트
```bash
# 최신 코드 가져오기
git pull origin main

# 의존성 업데이트
npm update

# 재빌드
npm run build
```

### 데이터베이스 마이그레이션
```bash
# 마이그레이션 실행
npm run migrate

# 롤백 (필요시)
npm run migrate:rollback
```

---

**참고**: 이 가이드는 기본적인 설정을 다루며, 프로덕션 환경에서는 보안, 성능, 모니터링 등을 추가로 고려해야 합니다. 