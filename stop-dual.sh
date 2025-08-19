#!/bin/bash

echo "🛑 고객 분석 시스템 듀얼 모드 중지..."

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 현재 디렉토리 확인
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo -e "${YELLOW}🛑 서비스 중지 중...${NC}"

# PID 파일에서 프로세스 종료
if [ -f ".backend.pid" ]; then
    BACKEND_PID=$(cat .backend.pid)
    if kill -0 $BACKEND_PID 2>/dev/null; then
        echo "🔧 백엔드 서버 중지 중 (PID: $BACKEND_PID)..."
        kill $BACKEND_PID
        sleep 2
        if kill -0 $BACKEND_PID 2>/dev/null; then
            echo "🔧 백엔드 서버 강제 종료 중..."
            kill -9 $BACKEND_PID
        fi
        echo -e "${GREEN}✅ 백엔드 서버 중지 완료${NC}"
    else
        echo -e "${YELLOW}⚠️ 백엔드 서버가 이미 종료됨${NC}"
    fi
    rm -f .backend.pid
else
    echo -e "${YELLOW}⚠️ 백엔드 PID 파일이 없음${NC}"
fi

if [ -f ".frontend.pid" ]; then
    FRONTEND_PID=$(cat .frontend.pid)
    if kill -0 $FRONTEND_PID 2>/dev/null; then
        echo "⚛️ React 프론트엔드 중지 중 (PID: $FRONTEND_PID)..."
        kill $FRONTEND_PID
        sleep 2
        if kill -0 $FRONTEND_PID 2>/dev/null; then
            echo "⚛️ React 프론트엔드 강제 종료 중..."
            kill -9 $FRONTEND_PID
        fi
        echo -e "${GREEN}✅ React 프론트엔드 중지 완료${NC}"
    else
        echo -e "${YELLOW}⚠️ React 프론트엔드가 이미 종료됨${NC}"
    fi
    rm -f .frontend.pid
else
    echo -e "${YELLOW}⚠️ React PID 파일이 없음${NC}"
fi

if [ -f ".streamlit.pid" ]; then
    STREAMLIT_PID=$(cat .streamlit.pid)
    if kill -0 $STREAMLIT_PID 2>/dev/null; then
        echo "🐍 Streamlit 앱 중지 중 (PID: $STREAMLIT_PID)..."
        kill $STREAMLIT_PID
        sleep 2
        if kill -0 $STREAMLIT_PID 2>/dev/null; then
            echo "🐍 Streamlit 앱 강제 종료 중..."
            kill -9 $STREAMLIT_PID
        fi
        echo -e "${GREEN}✅ Streamlit 앱 중지 완료${NC}"
    else
        echo -e "${YELLOW}⚠️ Streamlit 앱이 이미 종료됨${NC}"
    fi
    rm -f .streamlit.pid
else
    echo -e "${YELLOW}⚠️ Streamlit PID 파일이 없음${NC}"
fi

# 추가 프로세스 정리
echo -e "${YELLOW}🧹 추가 프로세스 정리 중...${NC}"
pkill -f "node.*backend" 2>/dev/null || true
pkill -f "react-scripts" 2>/dev/null || true
pkill -f "streamlit" 2>/dev/null || true

# 포트 사용 확인
echo -e "${BLUE}🔍 포트 상태 확인:${NC}"
if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null ; then
    echo -e "${RED}❌ 포트 3001 (백엔드) 여전히 사용 중${NC}"
else
    echo -e "${GREEN}✅ 포트 3001 (백엔드) 해제됨${NC}"
fi

if lsof -Pi :8100 -sTCP:LISTEN -t >/dev/null ; then
    echo -e "${RED}❌ 포트 8100 (React) 여전히 사용 중${NC}"
else
    echo -e "${GREEN}✅ 포트 8100 (React) 해제됨${NC}"
fi

if lsof -Pi :8501 -sTCP:LISTEN -t >/dev/null ; then
    echo -e "${RED}❌ 포트 8501 (Streamlit) 여전히 사용 중${NC}"
else
    echo -e "${GREEN}✅ 포트 8501 (Streamlit) 해제됨${NC}"
fi

echo ""
echo -e "${GREEN}🎉 모든 서비스가 중지되었습니다.${NC}"
echo ""
echo -e "${BLUE}📊 로그 파일 위치:${NC}"
echo "  logs/backend.log"
echo "  logs/frontend.log"
echo "  logs/streamlit.log"
echo ""
echo -e "${YELLOW}💡 시스템 재시작:${NC}"
echo "  ./start-dual.sh"
