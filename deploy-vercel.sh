#!/bin/bash

echo "🚀 Vercel 배포 스크립트 시작"

# 색상 정의
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}📋 React 앱 빌드 중...${NC}"
cd frontend
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ 빌드 성공${NC}"
    echo -e "${YELLOW}📝 Vercel 배포를 위해 다음 단계를 따라하세요:${NC}"
    echo ""
    echo "1. https://vercel.com 접속"
    echo "2. GitHub 계정으로 로그인"
    echo "3. 'New Project' 클릭"
    echo "4. 저장소 선택: customer-analytics-system"
    echo "5. Framework: Create React App"
    echo "6. Root Directory: frontend"
    echo "7. 'Deploy' 클릭"
    echo ""
    echo -e "${GREEN}🎉 배포 완료 후 제공되는 URL로 접속하세요!${NC}"
else
    echo -e "${RED}❌ 빌드 실패${NC}"
    exit 1
fi

cd ..
