# 고객 행동 데이터 분석 시스템

실시간 고객 여정 분석과 퍼널 추적을 위한 종합적인 분석 시스템입니다.

## 🌟 주요 기능

- **실시간 대시보드**: 고객 행동 데이터의 실시간 모니터링
- **퍼널 분석**: 고객 여정 단계별 전환율 분석
- **KPI 추적**: 핵심 성과 지표의 트렌드 분석
- **고객 여정 맵**: 시각적 고객 여정 단계 분석
- **카테고리별 분류**: 리드 생성, 제품 개발, 고객 서비스, 마케팅별 분석
- **날짜 범위 필터링**: 기간별 데이터 분석

## 🚀 빠른 시작

### Streamlit Cloud 배포 (권장)

1. **GitHub 저장소 클론**
   ```bash
   git clone https://github.com/your-username/customer-analytics-system.git
   cd customer-analytics-system
   ```

2. **Streamlit Cloud에서 배포**
   - [Streamlit Cloud](https://share.streamlit.io/)에 접속
   - GitHub 계정으로 로그인
   - "New app" 클릭
   - 저장소 선택: `customer-analytics-system`
   - Main file path: `app.py`
   - Deploy 클릭

3. **접속**
   - 배포 완료 후 제공되는 URL로 접속

### 로컬 개발 환경

#### Docker 사용 (권장)

```bash
# 전체 시스템 시작
./start.sh

# 개발 모드 시작
./start-dev.sh
```

#### 로컬 환경 설정

1. **백엔드 설정**
   ```bash
   cd backend
   npm install
   npm start
   ```

2. **프론트엔드 설정**
   ```bash
   cd frontend
   npm install
   npm start
   ```

3. **Streamlit 앱 설정**
   ```bash
   cd streamlit
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   streamlit run app.py
   ```

## 📊 사용 방법

1. **대시보드 접속**
   - 브라우저에서 `http://localhost:8100` (React) 또는 `http://localhost:8501` (Streamlit) 접속

2. **데이터 생성**
   - 관리자 패널에서 시나리오 선택
   - 이벤트 기록 또는 모의 데이터 생성

3. **분석 확인**
   - 실시간으로 대시보드 데이터 확인
   - 카테고리별 필터링 사용
   - 날짜 범위 설정

## 🏗️ 프로젝트 구조

```
customer-analytics-system/
├── backend/                 # Node.js + Express 백엔드
│   ├── src/
│   │   ├── controllers/     # API 컨트롤러
│   │   ├── routes/         # API 라우트
│   │   ├── models/         # 데이터 모델
│   │   └── services/       # 비즈니스 로직
│   └── package.json
├── frontend/               # React + TypeScript 프론트엔드
│   ├── src/
│   │   ├── components/     # React 컴포넌트
│   │   ├── services/       # API 서비스
│   │   └── types/         # TypeScript 타입 정의
│   └── package.json
├── streamlit/              # Streamlit 앱
│   ├── app.py             # 메인 Streamlit 앱
│   └── requirements.txt   # Python 의존성
├── database/              # 데이터베이스 스키마
├── docker/               # Docker 설정
├── app.py                # Streamlit Cloud용 메인 파일
├── requirements.txt      # Streamlit Cloud용 의존성
└── README.md
```

## 🔌 API 엔드포인트

### 대시보드 API
- `GET /api/dashboard/overview` - 대시보드 개요 데이터
- `GET /api/dashboard/funnels` - 퍼널 분석 데이터
- `GET /api/dashboard/kpi-trends` - KPI 트렌드 데이터
- `GET /api/dashboard/recent-events` - 최근 이벤트 데이터

### 이벤트 API
- `POST /api/events` - 이벤트 생성
- `GET /api/events` - 이벤트 조회

### 시나리오 API
- `GET /api/scenarios` - 시나리오 목록
- `POST /api/scenarios` - 시나리오 생성

## 🛠️ 기술 스택

### 백엔드
- **Node.js** + **Express**
- **TypeScript**
- **PostgreSQL** (데이터베이스)
- **Redis** (캐싱)

### 프론트엔드
- **React 18** + **TypeScript**
- **Tailwind CSS** (스타일링)
- **Chart.js** (차트 라이브러리)
- **Axios** (HTTP 클라이언트)

### Streamlit
- **Python 3.13**
- **Streamlit** (웹 앱 프레임워크)
- **Plotly** (인터랙티브 차트)
- **Pandas** (데이터 처리)

### 인프라
- **Docker** & **Docker Compose**
- **Nginx** (리버스 프록시)

## 📈 실제 사용 시나리오

### 1. 이커머스 고객 분석
- **시나리오**: 온라인 쇼핑몰 고객 여정
- **단계**: 홈페이지 방문 → 상품 탐색 → 장바구니 추가 → 결제 완료
- **분석**: 각 단계별 이탈률과 전환율 분석

### 2. SaaS 제품 온보딩
- **시나리오**: 신규 사용자 온보딩 프로세스
- **단계**: 회원가입 → 이메일 인증 → 튜토리얼 → 첫 사용
- **분석**: 온보딩 완료율과 사용자 활성화 지표

### 3. 마케팅 캠페인 효과
- **시나리오**: 이메일 마케팅 캠페인
- **단계**: 이메일 발송 → 이메일 열람 → 링크 클릭 → 전환
- **분석**: 캠페인별 성과와 ROI 분석

## 🔧 개발 환경 설정

### 필수 요구사항
- Node.js 18+
- Python 3.11+
- Docker & Docker Compose
- PostgreSQL 14+
- Redis 6+

### 환경 변수 설정
```bash
# .env 파일 생성
cp .env.example .env

# 환경 변수 설정
DB_HOST=localhost
DB_PORT=5432
DB_NAME=customer_analytics
DB_USER=postgres
DB_PASSWORD=your_password
REDIS_URL=redis://localhost:6379
```

## 🚀 배포

### Streamlit Cloud 배포
1. GitHub 저장소에 코드 푸시
2. Streamlit Cloud에서 저장소 연결
3. 자동 배포 완료

### Docker 배포
```bash
# 프로덕션 빌드
docker-compose -f docker-compose.prod.yml up -d

# 개발 환경
docker-compose up -d
```

## 📊 성능 최적화

### 백엔드 최적화
- Redis 캐싱 적용
- 데이터베이스 인덱싱
- API 응답 압축

### 프론트엔드 최적화
- 코드 스플리팅
- 이미지 최적화
- CDN 사용

### 데이터베이스 최적화
- 쿼리 최적화
- 파티셔닝
- 백업 전략

## 🔒 보안 고려사항

### API 보안
- JWT 토큰 인증
- Rate limiting
- CORS 설정

### 데이터 보안
- 데이터 암호화
- 접근 권한 관리
- 감사 로그

## 🐛 문제 해결

### 일반적인 문제들

1. **포트 충돌**
   ```bash
   # 사용 중인 포트 확인
   lsof -i :3001
   lsof -i :8100
   lsof -i :8501
   ```

2. **데이터베이스 연결 오류**
   ```bash
   # PostgreSQL 상태 확인
   brew services list | grep postgresql
   ```

3. **Docker 컨테이너 문제**
   ```bash
   # 컨테이너 로그 확인
   docker-compose logs
   ```

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 지원

- **이슈 리포트**: [GitHub Issues](https://github.com/your-username/customer-analytics-system/issues)
- **문서**: [Wiki](https://github.com/your-username/customer-analytics-system/wiki)
- **이메일**: support@example.com

---

**고객 행동 데이터 분석 시스템** - 실시간 고객 여정 분석을 위한 강력한 도구 