#!/bin/bash

echo "📊 고객 분석 시스템 듀얼 모드 상태 확인..."

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 현재 디렉토리 확인
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo -e "${BLUE}🔍 서비스 상태 확인:${NC}"
echo ""

# 백엔드 상태 확인
echo -e "${BLUE}🔧 백엔드 서버 (포트 3001):${NC}"
if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null ; then
    BACKEND_PID=$(lsof -Pi :3001 -sTCP:LISTEN -t)
    echo -e "  ${GREEN}✅ 실행 중 (PID: $BACKEND_PID)${NC}"
    
    # API 응답 확인
    if curl -s http://localhost:3001/api/dashboard/overview > /dev/null; then
        echo -e "  ${GREEN}✅ API 응답 정상${NC}"
    else
        echo -e "  ${RED}❌ API 응답 오류${NC}"
    fi
else
    echo -e "  ${RED}❌ 중지됨${NC}"
fi

# React 프론트엔드 상태 확인
echo -e "${BLUE}⚛️ React 프론트엔드 (포트 8100):${NC}"
if lsof -Pi :8100 -sTCP:LISTEN -t >/dev/null ; then
    FRONTEND_PID=$(lsof -Pi :8100 -sTCP:LISTEN -t)
    echo -e "  ${GREEN}✅ 실행 중 (PID: $FRONTEND_PID)${NC}"
    
    # 웹 페이지 응답 확인
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8100)
    if [ "$HTTP_CODE" = "200" ]; then
        echo -e "  ${GREEN}✅ 웹 페이지 정상 (HTTP $HTTP_CODE)${NC}"
    else
        echo -e "  ${RED}❌ 웹 페이지 오류 (HTTP $HTTP_CODE)${NC}"
    fi
else
    echo -e "  ${RED}❌ 중지됨${NC}"
fi

# Streamlit 앱 상태 확인
echo -e "${BLUE}🐍 Streamlit 앱 (포트 8501):${NC}"
if lsof -Pi :8501 -sTCP:LISTEN -t >/dev/null ; then
    STREAMLIT_PID=$(lsof -Pi :8501 -sTCP:LISTEN -t)
    echo -e "  ${GREEN}✅ 실행 중 (PID: $STREAMLIT_PID)${NC}"
    
    # 웹 페이지 응답 확인
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8501)
    if [ "$HTTP_CODE" = "200" ]; then
        echo -e "  ${GREEN}✅ 웹 페이지 정상 (HTTP $HTTP_CODE)${NC}"
    else
        echo -e "  ${RED}❌ 웹 페이지 오류 (HTTP $HTTP_CODE)${NC}"
    fi
else
    echo -e "  ${RED}❌ 중지됨${NC}"
fi

echo ""
echo -e "${BLUE}📊 시스템 요약:${NC}"

# 실행 중인 서비스 수 계산
RUNNING_SERVICES=0
if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null ; then RUNNING_SERVICES=$((RUNNING_SERVICES + 1)); fi
if lsof -Pi :8100 -sTCP:LISTEN -t >/dev/null ; then RUNNING_SERVICES=$((RUNNING_SERVICES + 1)); fi
if lsof -Pi :8501 -sTCP:LISTEN -t >/dev/null ; then RUNNING_SERVICES=$((RUNNING_SERVICES + 1)); fi

if [ $RUNNING_SERVICES -eq 3 ]; then
    echo -e "  ${GREEN}🎉 모든 서비스 정상 실행 중 (3/3)${NC}"
elif [ $RUNNING_SERVICES -gt 0 ]; then
    echo -e "  ${YELLOW}⚠️ 일부 서비스 실행 중 ($RUNNING_SERVICES/3)${NC}"
else
    echo -e "  ${RED}❌ 모든 서비스 중지됨 (0/3)${NC}"
fi

echo ""
echo -e "${BLUE}🌐 접속 정보:${NC}"
echo "  📊 React 대시보드: http://localhost:8100"
echo "  🐍 Streamlit 앱: http://localhost:8501"
echo "  🔌 백엔드 API: http://localhost:3001"
echo ""

# 로그 파일 정보
echo -e "${BLUE}📋 로그 파일:${NC}"
if [ -f "logs/backend.log" ]; then
    BACKEND_LOG_SIZE=$(du -h logs/backend.log | cut -f1)
    echo "  🔧 백엔드: logs/backend.log ($BACKEND_LOG_SIZE)"
else
    echo "  🔧 백엔드: logs/backend.log (없음)"
fi

if [ -f "logs/frontend.log" ]; then
    FRONTEND_LOG_SIZE=$(du -h logs/frontend.log | cut -f1)
    echo "  ⚛️ React: logs/frontend.log ($FRONTEND_LOG_SIZE)"
else
    echo "  ⚛️ React: logs/frontend.log (없음)"
fi

if [ -f "logs/streamlit.log" ]; then
    STREAMLIT_LOG_SIZE=$(du -h logs/streamlit.log | cut -f1)
    echo "  🐍 Streamlit: logs/streamlit.log ($STREAMLIT_LOG_SIZE)"
else
    echo "  🐍 Streamlit: logs/streamlit.log (없음)"
fi

echo ""
echo -e "${YELLOW}💡 명령어:${NC}"
echo "  시스템 시작: ./start-dual.sh"
echo "  시스템 중지: ./stop-dual.sh"
echo "  상태 확인: ./status-dual.sh"
echo ""
echo -e "${YELLOW}📊 실시간 로그 확인:${NC}"
echo "  백엔드: tail -f logs/backend.log"
echo "  React: tail -f logs/frontend.log"
echo "  Streamlit: tail -f logs/streamlit.log"
