#!/bin/bash

echo "🚀 Streamlit 고객 분석 시스템을 시작합니다..."

# Python 가상환경 확인 및 생성
if [ ! -d "venv" ]; then
    echo "📦 Python 가상환경을 생성합니다..."
    python3 -m venv venv
fi

# 가상환경 활성화
echo "🔧 가상환경을 활성화합니다..."
source venv/bin/activate

# 패키지 설치
echo "📚 필요한 패키지를 설치합니다..."
pip install -r requirements.txt

# 백엔드 서버 상태 확인
echo "🔍 백엔드 서버 상태를 확인합니다..."
if curl -s http://localhost:3001/api/dashboard/overview > /dev/null; then
    echo "✅ 백엔드 서버가 실행 중입니다."
else
    echo "⚠️  백엔드 서버가 실행되지 않았습니다. 백엔드를 먼저 시작해주세요."
    echo "   cd ../backend && npm start"
    exit 1
fi

# Streamlit 앱 시작
echo "🌐 Streamlit 앱을 시작합니다..."
echo "   접속 주소: http://localhost:8501"
echo ""
echo "🛑 중지하려면 Ctrl+C를 누르세요."
echo ""

streamlit run app.py --server.port 8501 --server.address 0.0.0.0
