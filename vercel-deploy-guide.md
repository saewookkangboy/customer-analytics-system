# Vercel 배포 가이드

## 🚀 Vercel을 통한 React 데모 배포

### 1단계: Vercel 계정 생성
1. [Vercel](https://vercel.com) 접속
2. GitHub 계정으로 로그인
3. "New Project" 클릭

### 2단계: 프로젝트 연결
1. GitHub 저장소 선택: `customer-analytics-system`
2. Framework Preset: "Create React App" 선택
3. Root Directory: `frontend` 선택
4. Build Command: `npm run build` (기본값)
5. Output Directory: `build` (기본값)

### 3단계: 환경 변수 설정
```
REACT_APP_API_URL=https://your-backend-url.com/api
REACT_APP_ENVIRONMENT=production
```

### 4단계: 배포
- "Deploy" 클릭
- 배포 완료 후 제공되는 URL로 접속

### 5단계: 커스텀 도메인 (선택사항)
- Settings → Domains에서 커스텀 도메인 설정 가능

## 🔗 배포된 URL
배포 완료 후 다음과 같은 URL로 접속 가능:
- `https://customer-analytics-system-xxx.vercel.app`

## 📱 기능 확인
배포된 사이트에서 다음 기능들이 정상 작동하는지 확인:
- ✅ 대시보드
- ✅ KPI 분석
- ✅ 고객 여정 맵
- ✅ 설정 페이지
- ✅ 반응형 디자인
