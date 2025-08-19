#!/bin/bash

echo "🚀 고객 행동 데이터 분석 시스템 (개발 모드)을 시작합니다..."

# Node.js가 설치되어 있는지 확인
if ! command -v node &> /dev/null; then
    echo "❌ Node.js가 설치되지 않았습니다. Node.js를 먼저 설치해주세요."
    exit 1
fi

# npm이 설치되어 있는지 확인
if ! command -v npm &> /dev/null; then
    echo "❌ npm이 설치되지 않았습니다. npm을 먼저 설치해주세요."
    exit 1
fi

echo "📦 백엔드 의존성을 설치합니다..."
cd backend
npm install

echo "🔧 백엔드 개발 서버를 시작합니다..."
npm run dev &
BACKEND_PID=$!

echo "📦 프론트엔드 의존성을 설치합니다..."
cd ../frontend
npm install

echo "🎨 프론트엔드 개발 서버를 시작합니다..."
npm start &
FRONTEND_PID=$!

echo ""
echo "✅ 개발 서버가 성공적으로 시작되었습니다!"
echo ""
echo "🌐 접속 정보:"
echo "   - 프론트엔드: http://localhost:8100"
echo "   - 백엔드 API: http://localhost:3001"
echo ""
echo "📊 사용 방법:"
echo "   1. 브라우저에서 http://localhost:8100 접속"
echo "   2. 대시보드에서 '관리자 패널' 버튼 클릭"
echo "   3. 시나리오 선택 후 이벤트 기록 또는 모의 데이터 생성"
echo "   4. 실시간으로 대시보드 데이터 확인"
echo ""
echo "🛑 시스템 중지: Ctrl+C"

# 프로세스 종료 처리
trap 'echo ""; echo "🛑 시스템을 종료합니다..."; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0' INT

# 프로세스가 실행 중인 동안 대기
wait 