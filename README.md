# 고객 분석 시스템 (Customer Analytics System)

실시간 고객 여정 분석과 퍼널 분석을 통한 인사이트 제공 시스템

## 🚀 빠른 시작

### 듀얼 시스템 (React + Streamlit) - 로컬 환경

```bash
# 모든 서비스 시작 (Backend + React + Streamlit)
./start-dual.sh

# 서비스 상태 확인
./status-dual.sh

# 모든 서비스 중지
./stop-dual.sh
```

**접속 정보:**
- **React 앱**: http://localhost:8100
- **Streamlit 앱**: http://localhost:8501
- **Backend API**: http://localhost:3001

## 🌐 React 데모 웹 배포

React로 만든 페이지를 웹에서 데모로 활용할 수 있는 다양한 배포 방법을 제공합니다.

### 🎯 자동 배포 스크립트

```bash
# 배포 스크립트 실행
./deploy-react-demo.sh
```

### 📋 배포 옵션

#### 1. **Vercel 배포 (추천)**
- **장점**: 무료, 자동 배포, 빠른 속도
- **URL**: `https://your-app.vercel.app`
- **설정**: `vercel.json` 파일 사용

```bash
# Vercel CLI 설치
npm install -g vercel

# 배포
cd frontend
vercel --prod
```

#### 2. **Netlify 배포**
- **장점**: 무료, 자동 배포, 폼 처리
- **URL**: `https://your-app.netlify.app`
- **설정**: `netlify.toml` 파일 사용

```bash
# Netlify CLI 설치
npm install -g netlify-cli

# 배포
cd frontend
netlify deploy --prod --dir=build
```

#### 3. **GitHub Pages 배포**
- **장점**: 무료, GitHub 연동
- **URL**: `https://username.github.io/repository-name`
- **설정**: 자동으로 `gh-pages` 브랜치 생성

```bash
cd frontend
npm install --save-dev gh-pages
npm run deploy
```

#### 4. **Docker 배포**
- **장점**: 컨테이너화, 확장성
- **URL**: `http://localhost:8080`
- **설정**: `Dockerfile` 사용

```bash
cd frontend
docker build -t customer-analytics-frontend .
docker run -d -p 8080:80 customer-analytics-frontend
```

#### 5. **로컬 데모 서버**
- **장점**: 빠른 테스트, 오프라인 사용
- **URL**: `http://localhost:8080`

```bash
cd frontend
npm install -g serve
npm run build
serve -s build -l 8080
```

### 🔧 수동 배포 단계

#### **1단계: React 앱 빌드**
```bash
cd frontend
npm install
npm run build
```

#### **2단계: 배포 플랫폼 선택**

**Vercel (추천):**
1. [Vercel](https://vercel.com) 가입
2. GitHub 저장소 연결
3. 자동 배포 활성화

**Netlify:**
1. [Netlify](https://netlify.com) 가입
2. GitHub 저장소 연결
3. 빌드 설정: `npm run build`
4. 배포 디렉토리: `build`

**GitHub Pages:**
1. 저장소 설정 → Pages
2. Source: `gh-pages` 브랜치
3. 자동 배포 활성화

### 🌍 환경 변수 설정

배포 시 다음 환경 변수를 설정하세요:

```bash
REACT_APP_API_URL=https://your-backend-url.com/api
REACT_APP_ENVIRONMENT=production
```

### 📱 반응형 디자인

React 앱은 모든 디바이스에서 최적화되어 있습니다:
- **데스크톱**: 1920px 이상
- **태블릿**: 768px - 1024px
- **모바일**: 320px - 767px

### 🎨 디자인 시스템

- **색상**: Tailwind CSS 기반
- **아이콘**: Heroicons
- **차트**: Chart.js
- **UI 컴포넌트**: Headless UI

## ☁️ Streamlit Cloud 배포

### 자동 배포 (GitHub Actions)

```bash
# 코드 푸시 시 자동 배포
git add .
git commit -m "Update app"
git push origin main
```

### 수동 배포

1. [Streamlit Cloud](https://share.streamlit.io) 접속
2. GitHub 저장소 연결
3. 메인 파일: `app.py`
4. 배포

**URL**: `https://share.streamlit.io/username/repository-name/main/app.py`

## 📊 기능 비교

| 기능 | React 버전 | Streamlit 버전 |
|------|------------|----------------|
| 대시보드 | ✅ 완전 구현 | ✅ 완전 구현 |
| KPI 분석 | ✅ 완전 구현 | ✅ 완전 구현 |
| 고객 여정 맵 | ✅ 완전 구현 | ✅ 완전 구현 |
| 설정 페이지 | ✅ 완전 구현 | ✅ 완전 구현 |
| 반응형 디자인 | ✅ 최적화 | ✅ 최적화 |
| 실시간 데이터 | ✅ API 연동 | ✅ 모의 데이터 |
| 배포 난이도 | 중간 | 쉬움 |
| 커스터마이징 | 높음 | 중간 |

## 🎯 사용 시나리오

### React 버전 사용 시기:
- **고객 데모**: 전문적인 외관 필요
- **프로덕션 환경**: 실제 API 연동
- **복잡한 인터랙션**: 고급 UI/UX 필요
- **성능 최적화**: 빠른 로딩 속도 필요

### Streamlit 버전 사용 시기:
- **빠른 프로토타이핑**: 신속한 개발
- **데이터 분석**: Python 기반 분석
- **내부 도구**: 팀 내부 사용
- **간단한 배포**: 클릭 한 번으로 배포

## 🛠️ 기술 스택

### Backend
- **Node.js** + **Express**
- **TypeScript**
- **PostgreSQL** + **Redis**
- **Docker**

### Frontend (React)
- **React 18** + **TypeScript**
- **Tailwind CSS**
- **Chart.js** + **react-chartjs-2**
- **React Router DOM**
- **Axios**

### Frontend (Streamlit)
- **Python 3.13**
- **Streamlit**
- **Plotly**
- **Pandas**

## 📁 프로젝트 구조

```
customer-analytics-system/
├── backend/                 # Node.js API 서버
├── frontend/               # React 앱
├── streamlit/              # Streamlit 앱
├── database/               # 데이터베이스 스키마
├── docker/                 # Docker 설정
├── docs/                   # 문서
├── app.py                  # Streamlit 메인 앱
├── requirements.txt        # Python 의존성
├── vercel.json            # Vercel 배포 설정
├── netlify.toml           # Netlify 배포 설정
├── deploy-react-demo.sh   # React 배포 스크립트
├── start-dual.sh          # 듀얼 시스템 시작
├── stop-dual.sh           # 듀얼 시스템 중지
└── status-dual.sh         # 시스템 상태 확인
```

## 🚀 배포 가이드

### React 데모 배포

1. **자동 배포 (추천)**:
   ```bash
   ./deploy-react-demo.sh
   ```

2. **수동 배포**:
   - Vercel: `vercel --prod`
   - Netlify: `netlify deploy --prod`
   - GitHub Pages: `npm run deploy`

### Streamlit 배포

1. **자동 배포**: GitHub 푸시 시 자동
2. **수동 배포**: Streamlit Cloud에서 설정

## 📞 지원

문제가 발생하면 다음을 확인하세요:

1. **로그 확인**: `./status-dual.sh`
2. **포트 충돌**: 3001, 8100, 8501 포트 확인
3. **의존성 설치**: `npm install` 및 `pip install -r requirements.txt`

## 📄 라이선스

MIT License 