#!/bin/bash

echo "🚀 Streamlit Cloud 자동 배포 스크립트 시작..."

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 현재 저장소 정보 확인
REPO_URL=$(git remote get-url origin)
REPO_NAME=$(basename -s .git $REPO_URL)

echo -e "${BLUE}📋 저장소 정보:${NC}"
echo "  저장소: $REPO_NAME"
echo "  URL: $REPO_URL"
echo ""

# Git 상태 확인
if [[ -n $(git status --porcelain) ]]; then
    echo -e "${YELLOW}⚠️  커밋되지 않은 변경사항이 있습니다.${NC}"
    git status --short
    echo ""
    read -p "계속 진행하시겠습니까? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "배포가 취소되었습니다."
        exit 1
    fi
fi

# 변경사항 커밋 및 푸시
echo -e "${BLUE}📤 변경사항을 GitHub에 푸시합니다...${NC}"
git add .
git commit -m "Auto-deploy: Update Streamlit Cloud configuration"
git push origin main

echo -e "${GREEN}✅ 코드가 GitHub에 푸시되었습니다!${NC}"
echo ""

# Streamlit Cloud 배포 정보 출력
echo -e "${BLUE}🌐 Streamlit Cloud 배포 정보:${NC}"
echo "  저장소: $REPO_NAME"
echo "  브랜치: main"
echo "  메인 파일: app.py"
echo "  환경 변수: STREAMLIT_CLOUD=true"
echo ""

echo -e "${YELLOW}📝 다음 단계를 진행하세요:${NC}"
echo "1. https://share.streamlit.io/ 에 접속"
echo "2. GitHub 계정으로 로그인"
echo "3. 'New app' 버튼 클릭"
echo "4. Repository: $REPO_NAME 선택"
echo "5. Main file path: app.py 입력"
echo "6. Deploy 버튼 클릭"
echo ""

# 배포 확인 스크립트
echo -e "${BLUE}🔍 배포 확인 스크립트:${NC}"
cat << 'EOF'
#!/bin/bash
# 배포 후 실행할 스크립트
echo "배포 상태 확인 중..."
# 여기에 배포 URL을 입력하세요
DEPLOY_URL="https://your-app-name.streamlit.app"
curl -s -o /dev/null -w "%{http_code}" $DEPLOY_URL
if [ $? -eq 0 ]; then
    echo "✅ 배포 성공!"
    echo "접속 URL: $DEPLOY_URL"
else
    echo "❌ 배포 실패"
fi
EOF

echo ""
echo -e "${GREEN}🎉 Streamlit Cloud 배포 준비가 완료되었습니다!${NC}"
echo ""
echo -e "${BLUE}📊 배포된 앱 기능:${NC}"
echo "  ✅ 실시간 대시보드"
echo "  ✅ 퍼널 분석 차트"
echo "  ✅ KPI 트렌드 분석"
echo "  ✅ 고객 여정 맵"
echo "  ✅ 카테고리별 필터링"
echo "  ✅ 모의 데이터 모드"
echo ""
echo -e "${YELLOW}💡 팁:${NC}"
echo "  - 배포 후 처음 로딩에 시간이 걸릴 수 있습니다"
echo "  - 모의 데이터 모드로 백엔드 없이도 완전히 작동합니다"
echo "  - 모든 차트와 시각화가 정상적으로 표시됩니다"
