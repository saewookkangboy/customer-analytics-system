#!/bin/bash

echo "🚀 고객 분석 시스템 듀얼 모드 시작..."

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 현재 디렉토리 확인
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo -e "${BLUE}📋 시스템 정보:${NC}"
echo "  백엔드 포트: 3001"
echo "  React 프론트엔드 포트: 8100"
echo "  Streamlit 포트: 8501"
echo ""

# 기존 프로세스 종료
echo -e "${YELLOW}🛑 기존 프로세스 종료 중...${NC}"
pkill -f "node.*backend" 2>/dev/null || true
pkill -f "react-scripts" 2>/dev/null || true
pkill -f "streamlit" 2>/dev/null || true
sleep 2

# 포트 사용 확인
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
        echo -e "${RED}❌ 포트 $port가 이미 사용 중입니다.${NC}"
        return 1
    else
        echo -e "${GREEN}✅ 포트 $port 사용 가능${NC}"
        return 0
    fi
}

echo -e "${BLUE}🔍 포트 상태 확인:${NC}"
check_port 3001 || exit 1
check_port 8100 || exit 1
check_port 8501 || exit 1
echo ""

# 백엔드 시작
echo -e "${BLUE}🔧 백엔드 서버 시작 중...${NC}"
cd backend
if [ ! -d "node_modules" ]; then
    echo "📦 백엔드 의존성 설치 중..."
    npm install
fi

# 백엔드를 백그라운드에서 시작
npm start > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
echo "백엔드 PID: $BACKEND_PID"

# 백엔드 시작 대기
echo "⏳ 백엔드 서버 시작 대기 중..."
sleep 5

# 백엔드 상태 확인
if curl -s http://localhost:3001/api/dashboard/overview > /dev/null; then
    echo -e "${GREEN}✅ 백엔드 서버 시작 완료${NC}"
else
    echo -e "${RED}❌ 백엔드 서버 시작 실패${NC}"
    exit 1
fi

cd ..

# React 프론트엔드 시작
echo -e "${BLUE}⚛️ React 프론트엔드 시작 중...${NC}"
cd frontend
if [ ! -d "node_modules" ]; then
    echo "📦 React 의존성 설치 중..."
    npm install
fi

# React를 백그라운드에서 시작
npm start > ../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
echo "React PID: $FRONTEND_PID"

cd ..

# Streamlit 앱 시작
echo -e "${BLUE}🐍 Streamlit 앱 시작 중...${NC}"
cd streamlit

# 가상환경 확인 및 생성
if [ ! -d "venv" ]; then
    echo "📦 Python 가상환경 생성 중..."
    python3 -m venv venv
fi

# 가상환경 활성화 및 의존성 설치
source venv/bin/activate
if [ ! -f "venv/lib/python*/site-packages/streamlit" ]; then
    echo "📦 Streamlit 의존성 설치 중..."
    pip install -r requirements.txt
fi

# Streamlit을 백그라운드에서 시작
streamlit run app.py --server.port 8501 --server.address 0.0.0.0 > ../logs/streamlit.log 2>&1 &
STREAMLIT_PID=$!
echo "Streamlit PID: $STREAMLIT_PID"

cd ..

# 로그 디렉토리 생성
mkdir -p logs

# 서비스 시작 대기
echo -e "${YELLOW}⏳ 모든 서비스 시작 대기 중...${NC}"
sleep 10

# 서비스 상태 확인
echo -e "${BLUE}🔍 서비스 상태 확인:${NC}"

# 백엔드 확인
if curl -s http://localhost:3001/api/dashboard/overview > /dev/null; then
    echo -e "${GREEN}✅ 백엔드 API (포트 3001)${NC}"
else
    echo -e "${RED}❌ 백엔드 API (포트 3001)${NC}"
fi

# React 프론트엔드 확인
if curl -s -o /dev/null -w "%{http_code}" http://localhost:8100 | grep -q "200"; then
    echo -e "${GREEN}✅ React 프론트엔드 (포트 8100)${NC}"
else
    echo -e "${RED}❌ React 프론트엔드 (포트 8100)${NC}"
fi

# Streamlit 확인
if curl -s -o /dev/null -w "%{http_code}" http://localhost:8501 | grep -q "200"; then
    echo -e "${GREEN}✅ Streamlit 앱 (포트 8501)${NC}"
else
    echo -e "${RED}❌ Streamlit 앱 (포트 8501)${NC}"
fi

echo ""
echo -e "${GREEN}🎉 듀얼 시스템 시작 완료!${NC}"
echo ""
echo -e "${BLUE}🌐 접속 정보:${NC}"
echo "  📊 React 대시보드: http://localhost:8100"
echo "  🐍 Streamlit 앱: http://localhost:8501"
echo "  🔌 백엔드 API: http://localhost:3001"
echo ""
echo -e "${BLUE}📋 기능 비교:${NC}"
echo "  React 버전:"
echo "    - 고급 UI/UX"
echo "    - 실시간 업데이트"
echo "    - 복잡한 인터랙션"
echo "    - 관리자 패널"
echo ""
echo "  Streamlit 버전:"
echo "    - 빠른 프로토타이핑"
echo "    - 데이터 분석 중심"
echo "    - 간단한 설정"
echo "    - 클라우드 배포 용이"
echo ""
echo -e "${YELLOW}💡 사용 팁:${NC}"
echo "  - React: 고객용 대시보드, 복잡한 분석"
echo "  - Streamlit: 내부 분석, 빠른 인사이트"
echo "  - 두 버전 모두 동일한 백엔드 API 사용"
echo ""
echo -e "${YELLOW}🛑 시스템 중지:${NC}"
echo "  ./stop-dual.sh"
echo ""
echo -e "${YELLOW}📊 로그 확인:${NC}"
echo "  백엔드: tail -f logs/backend.log"
echo "  React: tail -f logs/frontend.log"
echo "  Streamlit: tail -f logs/streamlit.log"

# PID 파일 저장
echo $BACKEND_PID > .backend.pid
echo $FRONTEND_PID > .frontend.pid
echo $STREAMLIT_PID > .streamlit.pid

echo ""
echo -e "${GREEN}✅ 모든 서비스가 백그라운드에서 실행 중입니다.${NC}"
