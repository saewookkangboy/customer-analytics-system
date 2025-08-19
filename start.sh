#!/bin/bash

echo "🚀 고객 행동 데이터 분석 시스템을 시작합니다..."

# Docker가 실행 중인지 확인
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker가 실행되지 않았습니다. Docker를 먼저 시작해주세요."
    exit 1
fi

# Docker Compose로 서비스 시작
echo "📦 Docker 컨테이너를 시작합니다..."
cd docker
docker-compose up -d

# 서비스 상태 확인
echo "⏳ 서비스가 시작되는 동안 잠시 기다려주세요..."
sleep 10

# 서비스 상태 확인
echo "🔍 서비스 상태를 확인합니다..."
docker-compose ps

echo ""
echo "✅ 시스템이 성공적으로 시작되었습니다!"
echo ""
echo "🌐 접속 정보:"
echo "   - 프론트엔드: http://localhost:8100"
echo "   - 백엔드 API: http://localhost:3001"
echo "   - 데이터베이스: localhost:5432"
echo ""
echo "📊 사용 방법:"
echo "   1. 브라우저에서 http://localhost:8100 접속"
echo "   2. 대시보드에서 '관리자 패널' 버튼 클릭"
echo "   3. 시나리오 선택 후 이벤트 기록 또는 모의 데이터 생성"
echo "   4. 실시간으로 대시보드 데이터 확인"
echo ""
echo "🛑 시스템 중지: cd docker && docker-compose down" 