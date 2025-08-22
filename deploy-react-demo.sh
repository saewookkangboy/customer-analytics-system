#!/bin/bash

# React 데모 배포 스크립트
echo "🚀 React 데모 배포 스크립트 시작"

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 함수 정의
print_step() {
    echo -e "${BLUE}📋 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# 1. Vercel 배포
deploy_vercel() {
    print_step "Vercel 배포 시작"
    
    if ! command -v vercel &> /dev/null; then
        print_warning "Vercel CLI가 설치되지 않았습니다. 설치 중..."
        npm install -g vercel
    fi
    
    cd frontend
    print_step "React 앱 빌드 중..."
    npm run build
    
    if [ $? -eq 0 ]; then
        print_success "빌드 성공"
        print_step "Vercel에 배포 중..."
        vercel --prod
        print_success "Vercel 배포 완료!"
    else
        print_error "빌드 실패"
        return 1
    fi
    
    cd ..
}

# 2. Netlify 배포
deploy_netlify() {
    print_step "Netlify 배포 시작"
    
    if ! command -v netlify &> /dev/null; then
        print_warning "Netlify CLI가 설치되지 않았습니다. 설치 중..."
        npm install -g netlify-cli
    fi
    
    cd frontend
    print_step "React 앱 빌드 중..."
    npm run build
    
    if [ $? -eq 0 ]; then
        print_success "빌드 성공"
        print_step "Netlify에 배포 중..."
        netlify deploy --prod --dir=build
        print_success "Netlify 배포 완료!"
    else
        print_error "빌드 실패"
        return 1
    fi
    
    cd ..
}

# 3. GitHub Pages 배포
deploy_github_pages() {
    print_step "GitHub Pages 배포 시작"
    
    cd frontend
    
    # package.json에 homepage 추가
    if ! grep -q '"homepage"' package.json; then
        print_step "package.json에 homepage 설정 추가"
        sed -i '' 's/"private": true,/"private": true,\n  "homepage": "https:\/\/saewookkangboy.github.io\/customer-analytics-system",/' package.json
    fi
    
    # gh-pages 의존성 설치
    if ! npm list gh-pages &> /dev/null; then
        print_step "gh-pages 설치 중..."
        npm install --save-dev gh-pages
    fi
    
    # package.json에 배포 스크립트 추가
    if ! grep -q '"predeploy"' package.json; then
        print_step "배포 스크립트 추가"
        sed -i '' 's/"eject": "react-scripts eject"/"eject": "react-scripts eject",\n    "predeploy": "npm run build",\n    "deploy": "gh-pages -d build"/' package.json
    fi
    
    print_step "React 앱 빌드 중..."
    npm run build
    
    if [ $? -eq 0 ]; then
        print_success "빌드 성공"
        print_step "GitHub Pages에 배포 중..."
        npm run deploy
        print_success "GitHub Pages 배포 완료!"
    else
        print_error "빌드 실패"
        return 1
    fi
    
    cd ..
}

# 4. Docker 배포
deploy_docker() {
    print_step "Docker 배포 시작"
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker가 설치되지 않았습니다."
        return 1
    fi
    
    cd frontend
    print_step "Docker 이미지 빌드 중..."
    docker build -t customer-analytics-frontend .
    
    if [ $? -eq 0 ]; then
        print_success "Docker 이미지 빌드 성공"
        print_step "Docker 컨테이너 실행 중..."
        docker run -d -p 8080:80 --name customer-analytics-demo customer-analytics-frontend
        print_success "Docker 배포 완료! http://localhost:8080 에서 확인하세요."
    else
        print_error "Docker 빌드 실패"
        return 1
    fi
    
    cd ..
}

# 5. 로컬 데모 서버
start_local_demo() {
    print_step "로컬 데모 서버 시작"
    
    cd frontend
    
    # 프로덕션 빌드
    print_step "프로덕션 빌드 중..."
    npm run build
    
    if [ $? -eq 0 ]; then
        print_success "빌드 성공"
        
        # serve 패키지 설치
        if ! command -v serve &> /dev/null; then
            print_step "serve 패키지 설치 중..."
            npm install -g serve
        fi
        
        print_step "로컬 서버 시작 중..."
        serve -s build -l 8080
        print_success "로컬 데모 서버 시작! http://localhost:8080 에서 확인하세요."
    else
        print_error "빌드 실패"
        return 1
    fi
    
    cd ..
}

# 메인 메뉴
show_menu() {
    echo ""
    echo "🎯 React 데모 배포 옵션"
    echo "=========================="
    echo "1. Vercel 배포 (추천)"
    echo "2. Netlify 배포"
    echo "3. GitHub Pages 배포"
    echo "4. Docker 배포"
    echo "5. 로컬 데모 서버"
    echo "6. 모든 옵션 배포"
    echo "0. 종료"
    echo ""
    read -p "선택하세요 (0-6): " choice
}

# 메인 실행
main() {
    echo "🎉 React 데모 배포 도구"
    echo "========================"
    
    while true; do
        show_menu
        
        case $choice in
            1)
                deploy_vercel
                ;;
            2)
                deploy_netlify
                ;;
            3)
                deploy_github_pages
                ;;
            4)
                deploy_docker
                ;;
            5)
                start_local_demo
                ;;
            6)
                print_step "모든 배포 옵션 실행"
                deploy_vercel
                deploy_netlify
                deploy_github_pages
                deploy_docker
                print_success "모든 배포 완료!"
                ;;
            0)
                print_success "종료합니다."
                exit 0
                ;;
            *)
                print_error "잘못된 선택입니다."
                ;;
        esac
        
        echo ""
        read -p "계속하려면 Enter를 누르세요..."
    done
}

# 스크립트 실행
main
