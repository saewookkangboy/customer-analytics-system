# GitHub Pages 404 오류 해결 가이드

## 🔧 문제 해결 단계

### 1단계: GitHub 저장소 설정 확인

1. **GitHub 저장소 접속**:
   ```
   https://github.com/saewookkangboy/customer-analytics-system
   ```

2. **Settings → Pages**:
   - Settings 탭 클릭
   - 왼쪽 사이드바에서 "Pages" 클릭

3. **Source 설정**:
   - **Source**: "Deploy from a branch" 선택
   - **Branch**: `gh-pages` 선택
   - **Folder**: `/ (root)` 선택
   - **Save** 클릭

### 2단계: GitHub Actions 확인

1. **Actions 탭 확인**:
   ```
   https://github.com/saewookkangboy/customer-analytics-system/actions
   ```

2. **워크플로우 실행 상태**:
   - "Deploy to GitHub Pages" 워크플로우가 성공적으로 실행되었는지 확인
   - 실패한 경우 "Re-run jobs" 클릭

### 3단계: 브랜치 확인

1. **gh-pages 브랜치 확인**:
   ```
   https://github.com/saewookkangboy/customer-analytics-system/tree/gh-pages
   ```

2. **파일 존재 확인**:
   - `index.html` 파일이 있는지 확인
   - `static/` 폴더가 있는지 확인

### 4단계: 수동 배포

만약 자동 배포가 작동하지 않는다면:

```bash
# 로컬에서 수동 배포
cd frontend
npm run deploy
```

### 5단계: 대안 배포 방법

#### Vercel 배포 (추천)
1. [Vercel](https://vercel.com) 접속
2. GitHub 계정으로 로그인
3. "New Project" 클릭
4. 저장소 선택: `customer-analytics-system`
5. Framework: "Create React App"
6. Root Directory: `frontend`
7. "Deploy" 클릭

#### Netlify 배포
1. [Netlify](https://netlify.com) 접속
2. "New site from Git" 클릭
3. GitHub 저장소 연결
4. Build settings:
   - Build command: `cd frontend && npm run build`
   - Publish directory: `frontend/build`
5. "Deploy site" 클릭

## 🔍 문제 진단

### 일반적인 문제들:

1. **브랜치 이름 오류**:
   - gh-pages 브랜치가 정확히 `gh-pages`인지 확인

2. **빌드 실패**:
   - Actions 탭에서 빌드 로그 확인
   - 의존성 설치 오류 확인

3. **경로 문제**:
   - package.json의 homepage 설정 확인
   - React Router 설정 확인

4. **캐시 문제**:
   - 브라우저 캐시 삭제
   - 강력 새로고침 (Ctrl+F5)

## 📞 추가 지원

문제가 지속되면:
1. GitHub Issues에 문제 보고
2. Actions 로그 확인
3. 브라우저 개발자 도구에서 오류 확인
