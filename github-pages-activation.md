# GitHub Pages 활성화 가이드

## 🔧 GitHub Pages 404 오류 해결

### 1단계: GitHub 저장소 설정

1. **GitHub 저장소 접속**:
   ```
   https://github.com/saewookkangboy/customer-analytics-system
   ```

2. **Settings 탭 클릭**:
   - 저장소 상단의 "Settings" 탭 클릭

3. **Pages 설정 찾기**:
   - 왼쪽 사이드바에서 "Pages" 클릭
   - 또는 직접 URL: `https://github.com/saewookkangboy/customer-analytics-system/settings/pages`

### 2단계: Source 설정

1. **Source 선택**:
   - "Source" 섹션에서 "Deploy from a branch" 선택

2. **Branch 설정**:
   - "Branch" 드롭다운에서 `gh-pages` 선택
   - "Folder"는 `/ (root)`로 설정

3. **저장**:
   - "Save" 버튼 클릭

### 3단계: 배포 확인

1. **배포 상태 확인**:
   - Pages 설정 페이지에서 "Your site is live at" 메시지 확인
   - URL: `https://saewookkangboy.github.io/customer-analytics-system/`

2. **대기 시간**:
   - 설정 후 5-10분 대기
   - GitHub Actions가 자동으로 배포 진행

### 4단계: GitHub Actions 확인

1. **Actions 탭 확인**:
   ```
   https://github.com/saewookkangboy/customer-analytics-system/actions
   ```

2. **워크플로우 상태**:
   - "Deploy to GitHub Pages" 워크플로우가 성공적으로 실행되었는지 확인
   - 실패한 경우 "Re-run jobs" 클릭

### 5단계: 브라우저에서 확인

1. **URL 접속**:
   ```
   https://saewookkangboy.github.io/customer-analytics-system/
   ```

2. **캐시 문제 해결**:
   - 강력 새로고침: `Ctrl+F5` (Windows) 또는 `Cmd+Shift+R` (Mac)
   - 브라우저 캐시 삭제

## 🚀 대안: Vercel 배포 (추천)

GitHub Pages가 작동하지 않는 경우, Vercel을 사용하여 더 빠르고 안정적으로 배포할 수 있습니다.

### Vercel 배포 단계:

1. **[Vercel](https://vercel.com) 접속**

2. **GitHub 계정으로 로그인**

3. **"New Project" 클릭**

4. **저장소 선택**:
   - `customer-analytics-system` 선택

5. **프로젝트 설정**:
   - **Framework Preset**: "Create React App"
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (기본값)
   - **Output Directory**: `build` (기본값)

6. **"Deploy" 클릭**

7. **배포 완료 후 제공되는 URL로 접속**

### Vercel 배포 장점:
- ✅ 2-3분 내 배포 완료
- ✅ 자동 HTTPS
- ✅ 더 나은 성능
- ✅ 간단한 설정
- ✅ 커스텀 도메인 지원

## 📱 배포된 사이트 기능 확인

배포 완료 후 다음 기능들이 정상 작동하는지 확인:

### 대시보드:
- ✅ 실시간 메트릭 카드
- ✅ 카테고리별 필터링
- ✅ 인터랙티브 차트
- ✅ 자동 데이터 새로고침

### KPI 분석:
- ✅ 트렌드 차트
- ✅ 상세 분석 데이터
- ✅ 기간별 비교
- ✅ 데이터 테이블

### 고객 여정 맵:
- ✅ 퍼널 차트
- ✅ 단계별 분석
- ✅ 전환율 계산
- ✅ 이탈률 분석

### 설정 페이지:
- ✅ 시스템 설정
- ✅ 알림 설정
- ✅ UI 테마
- ✅ 차트 설정

## 🔍 문제 해결

### 일반적인 문제들:

1. **404 오류**:
   - GitHub Pages 설정 확인
   - gh-pages 브랜치 존재 확인
   - 5-10분 대기

2. **빌드 실패**:
   - Actions 탭에서 로그 확인
   - 의존성 설치 오류 확인

3. **스타일 문제**:
   - CSS 파일 경로 확인
   - 브라우저 캐시 삭제

4. **API 연결 오류**:
   - 환경 변수 설정 확인
   - CORS 설정 확인

## 📞 추가 지원

문제가 지속되면:
1. GitHub Issues에 문제 보고
2. Actions 로그 확인
3. 브라우저 개발자 도구에서 오류 확인
4. Vercel 배포로 대안 사용
