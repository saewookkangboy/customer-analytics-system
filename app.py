import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import requests
import json
from datetime import datetime, timedelta
from streamlit_option_menu import option_menu
import time

# 페이지 설정
st.set_page_config(
    page_title="고객 분석 시스템",
    page_icon="📊",
    layout="wide",
    initial_sidebar_state="expanded"
)

# CSS 스타일
st.markdown("""
<style>
    .main-header {
        font-size: 2.5rem;
        font-weight: bold;
        color: #1f77b4;
        text-align: center;
        margin-bottom: 2rem;
    }
    .metric-card {
        background-color: #f8f9fa;
        padding: 1rem;
        border-radius: 0.5rem;
        border-left: 4px solid #1f77b4;
        margin: 0.5rem 0;
    }
    .metric-value {
        font-size: 2rem;
        font-weight: bold;
        color: #1f77b4;
    }
    .metric-label {
        font-size: 0.9rem;
        color: #6c757d;
    }
    .success-message {
        background-color: #d4edda;
        color: #155724;
        padding: 1rem;
        border-radius: 0.5rem;
        margin: 1rem 0;
    }
    .error-message {
        background-color: #f8d7da;
        color: #721c24;
        padding: 1rem;
        border-radius: 0.5rem;
        margin: 1rem 0;
    }
</style>
""", unsafe_allow_html=True)

# API 설정 - Streamlit Cloud 배포용
import os

# 환경에 따라 API URL 설정
if os.getenv('STREAMLIT_CLOUD'):
    # Streamlit Cloud 환경에서는 모의 데이터 사용
    API_BASE_URL = None
    USE_MOCK_DATA = True
else:
    # 로컬 환경에서는 실제 API 사용
    API_BASE_URL = "http://localhost:3001/api"
    USE_MOCK_DATA = False

# 세션 상태 초기화
if 'selected_category' not in st.session_state:
    st.session_state.selected_category = 'all'
if 'show_journey_map' not in st.session_state:
    st.session_state.show_journey_map = False

def get_mock_dashboard_overview(category='all'):
    """모의 대시보드 개요 데이터"""
    return {
        "success": True,
        "data": {
            "total_users": 15420,
            "total_sessions": 28450,
            "total_conversions": 3240,
            "average_conversion_rate": 11.4
        }
    }

def get_mock_funnel_data(category='all'):
    """모의 퍼널 데이터"""
    return {
        "success": True,
        "data": [
            {
                "scenario_name": "신규 사용자 온보딩",
                "stage_name": "홈페이지 방문",
                "stage_order": 1,
                "users_reached": 1000,
                "conversion_rate": 100
            },
            {
                "scenario_name": "신규 사용자 온보딩",
                "stage_name": "상품 탐색",
                "stage_order": 2,
                "users_reached": 750,
                "conversion_rate": 75
            },
            {
                "scenario_name": "신규 사용자 온보딩",
                "stage_name": "장바구니 추가",
                "stage_order": 3,
                "users_reached": 450,
                "conversion_rate": 60
            },
            {
                "scenario_name": "신규 사용자 온보딩",
                "stage_name": "결제 완료",
                "stage_order": 4,
                "users_reached": 225,
                "conversion_rate": 50
            }
        ]
    }

def get_mock_kpi_trends(category='all'):
    """모의 KPI 트렌드 데이터"""
    return {
        "success": True,
        "data": [
            {"date": "2025-08-15", "value": 10.2},
            {"date": "2025-08-16", "value": 11.1},
            {"date": "2025-08-17", "value": 12.3},
            {"date": "2025-08-18", "value": 11.8},
            {"date": "2025-08-19", "value": 13.2}
        ]
    }

def get_mock_recent_events(category='all'):
    """모의 최근 이벤트 데이터"""
    return {
        "success": True,
        "data": [
            {
                "id": 1,
                "event_type": "page_view",
                "user_id": "user_001",
                "timestamp": "2025-08-19T07:00:00Z",
                "properties": {"page": "/home", "category": category}
            },
            {
                "id": 2,
                "event_type": "click",
                "user_id": "user_002",
                "timestamp": "2025-08-19T06:55:00Z",
                "properties": {"button": "signup", "category": category}
            },
            {
                "id": 3,
                "event_type": "purchase",
                "user_id": "user_003",
                "timestamp": "2025-08-19T06:50:00Z",
                "properties": {"amount": 99.99, "category": category}
            }
        ]
    }

def fetch_api_data(endpoint, params=None):
    """API 데이터 가져오기"""
    if USE_MOCK_DATA:
        # 모의 데이터 사용
        if endpoint == "dashboard/overview":
            category = params.get('category', 'all') if params else 'all'
            return get_mock_dashboard_overview(category)
        elif endpoint == "dashboard/funnels":
            category = params.get('category', 'all') if params else 'all'
            return get_mock_funnel_data(category)
        elif endpoint == "dashboard/kpi-trends":
            category = params.get('category', 'all') if params else 'all'
            return get_mock_kpi_trends(category)
        elif endpoint == "dashboard/recent-events":
            category = params.get('category', 'all') if params else 'all'
            return get_mock_recent_events(category)
        else:
            return {"success": False, "data": None}
    else:
        # 실제 API 호출
        try:
            url = f"{API_BASE_URL}/{endpoint}"
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            st.error(f"API 호출 오류: {str(e)}")
            return None

def create_metric_card(title, value, unit="", change=None, change_type="neutral"):
    """메트릭 카드 생성"""
    col1, col2 = st.columns([3, 1])
    
    with col1:
        st.markdown(f"""
        <div class="metric-card">
            <div class="metric-label">{title}</div>
            <div class="metric-value">{value:,.1f}{unit}</div>
        </div>
        """, unsafe_allow_html=True)
    
    with col2:
        if change is not None:
            if change_type == "positive":
                st.success(f"+{change:+.1f}%")
            elif change_type == "negative":
                st.error(f"{change:+.1f}%")
            else:
                st.info(f"{change:+.1f}%")

def create_funnel_chart(funnel_data):
    """퍼널 차트 생성"""
    if not funnel_data:
        return None
    
    stages = [stage['stage_name'] for stage in funnel_data]
    values = [stage['users_reached'] for stage in funnel_data]
    conversion_rates = [stage['conversion_rate'] for stage in funnel_data]
    
    fig = go.Figure()
    
    fig.add_trace(go.Funnel(
        y=stages,
        x=values,
        textinfo="value+percent initial",
        textposition="inside",
        marker={"color": ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd"]},
        connector={"line": {"color": "royalblue", "width": 3}}
    ))
    
    fig.update_layout(
        title="고객 여정 퍼널",
        height=400,
        showlegend=False
    )
    
    return fig

def create_kpi_trend_chart(kpi_data):
    """KPI 트렌드 차트 생성"""
    if not kpi_data:
        return None
    
    fig = go.Figure()
    
    # 단일 KPI 트렌드 데이터 처리
    dates = [item['date'] for item in kpi_data]
    values = [item['value'] for item in kpi_data]
    
    fig.add_trace(go.Scatter(
        x=dates,
        y=values,
        mode='lines+markers',
        name='KPI 트렌드',
        line=dict(width=3)
    ))
    
    fig.update_layout(
        title="KPI 트렌드",
        xaxis_title="날짜",
        yaxis_title="값",
        height=400,
        hovermode='x unified'
    )
    
    return fig

def create_customer_journey_map():
    """고객 여정 맵 생성"""
    journey_stages = [
        {"stage": "인지", "description": "브랜드/제품 인지", "metrics": {"방문자": 15000, "전환율": 8.5}},
        {"stage": "관심", "description": "제품 정보 탐색", "metrics": {"체류시간": 180, "페이지뷰": 4.2}},
        {"stage": "고려", "description": "제품 비교/검토", "metrics": {"장바구니": 3200, "비교율": 15.2}},
        {"stage": "결정", "description": "구매 결정", "metrics": {"구매": 1280, "전환율": 40.0}},
        {"stage": "유지", "description": "고객 유지", "metrics": {"재구매": 512, "만족도": 4.6}}
    ]
    
    fig = go.Figure()
    
    # 여정 단계별 박스 그리기
    for i, stage in enumerate(journey_stages):
        x_pos = i * 2
        y_pos = 0
        
        # 메인 박스
        fig.add_shape(
            type="rect",
            x0=x_pos-0.8, y0=y_pos-0.4,
            x1=x_pos+0.8, y1=y_pos+0.4,
            line=dict(color="blue", width=2),
            fillcolor="lightblue",
            opacity=0.7
        )
        
        # 단계명
        fig.add_annotation(
            x=x_pos, y=y_pos+0.6,
            text=stage["stage"],
            showarrow=False,
            font=dict(size=14, color="blue")
        )
        
        # 설명
        fig.add_annotation(
            x=x_pos, y=y_pos,
            text=stage["description"],
            showarrow=False,
            font=dict(size=10)
        )
        
        # 메트릭
        metrics_text = "<br>".join([f"{k}: {v}" for k, v in stage["metrics"].items()])
        fig.add_annotation(
            x=x_pos, y=y_pos-0.6,
            text=metrics_text,
            showarrow=False,
            font=dict(size=8),
            align="center"
        )
        
        # 화살표 (마지막 단계 제외)
        if i < len(journey_stages) - 1:
            fig.add_shape(
                type="line",
                x0=x_pos+0.8, y0=y_pos,
                x1=x_pos+1.2, y1=y_pos,
                line=dict(color="gray", width=2)
            )
            fig.add_annotation(
                x=x_pos+1, y=y_pos+0.1,
                text="→",
                showarrow=False,
                font=dict(size=16)
            )
    
    fig.update_layout(
        title="고객 여정 맵",
        xaxis=dict(showgrid=False, showticklabels=False, range=[-1, len(journey_stages)*2-1]),
        yaxis=dict(showgrid=False, showticklabels=False, range=[-1, 1]),
        height=300,
        showlegend=False
    )
    
    return fig

def dashboard_page():
    """대시보드 페이지"""
    st.markdown('<h1 class="main-header">📊 고객 분석 대시보드</h1>', unsafe_allow_html=True)
    
    # 카테고리 선택
    category = st.selectbox(
        "카테고리 선택",
        ["all", "lead_generation", "product_development", "customer_service", "marketing"],
        index=0,
        format_func=lambda x: {
            "all": "전체",
            "lead_generation": "리드 생성",
            "product_development": "제품 개발", 
            "customer_service": "고객 서비스",
            "marketing": "마케팅"
        }[x]
    )
    
    # API 데이터 가져오기
    overview_data = fetch_api_data("dashboard/overview", {"category": category})
    
    if overview_data and overview_data.get('success'):
        data = overview_data['data']
        
        # 메트릭 카드들
        col1, col2, col3, col4 = st.columns(4)
        
        with col1:
            create_metric_card("총 사용자", data['total_users'])
        
        with col2:
            create_metric_card("총 세션", data['total_sessions'])
        
        with col3:
            create_metric_card("총 전환", data['total_conversions'])
        
        with col4:
            create_metric_card("평균 전환율", data['average_conversion_rate'], "%")
        
        # 차트들
        col1, col2 = st.columns(2)
        
        with col1:
            # 퍼널 차트
            funnel_data = fetch_api_data("dashboard/funnels", {"category": category})
            if funnel_data and funnel_data.get('success'):
                fig = create_funnel_chart(funnel_data['data'])
                if fig:
                    st.plotly_chart(fig, use_container_width=True)
        
        with col2:
            # KPI 트렌드
            kpi_data = fetch_api_data("dashboard/kpi-trends", {"category": category})
            if kpi_data and kpi_data.get('success'):
                fig = create_kpi_trend_chart(kpi_data['data'])
                if fig:
                    st.plotly_chart(fig, use_container_width=True)
        
        # 최근 이벤트 테이블
        st.subheader("📋 최근 이벤트")
        events_data = fetch_api_data("dashboard/recent-events", {"category": category})
        if events_data and events_data.get('success'):
            df = pd.DataFrame(events_data['data'])
            if not df.empty:
                st.dataframe(df, use_container_width=True)
            else:
                st.info("최근 이벤트가 없습니다.")
    else:
        st.error("대시보드 데이터를 불러올 수 없습니다.")

def kpi_analytics_page():
    """KPI 분석 페이지"""
    st.markdown('<h1 class="main-header">📈 KPI 분석</h1>', unsafe_allow_html=True)
    
    # KPI 데이터 (임시)
    kpi_data = [
        {
            "name": "전환율",
            "category": "conversion",
            "current_value": 12.5,
            "target_value": 15.0,
            "unit": "%",
            "trend": [10.2, 11.1, 12.3, 11.8, 13.2, 12.5],
            "dates": ['2025-08-01', '2025-08-02', '2025-08-03', '2025-08-04', '2025-08-05', '2025-08-06'],
            "journeyStage": "결정 단계",
            "impact": "high",
            "description": "고객이 구매 결정을 내리고 실제 결제를 완료하는 비율",
            "improvement": "결제 프로세스 최적화, 장바구니 이탈률 감소"
        },
        {
            "name": "평균 체류시간",
            "category": "engagement",
            "current_value": 180,
            "target_value": 200,
            "unit": "초",
            "trend": [165, 172, 185, 178, 190, 180],
            "dates": ['2025-08-01', '2025-08-02', '2025-08-03', '2025-08-04', '2025-08-05', '2025-08-06'],
            "journeyStage": "고려 단계",
            "impact": "medium",
            "description": "고객이 제품 정보를 탐색하고 비교하는 시간",
            "improvement": "콘텐츠 품질 향상, 사용자 경험 개선"
        },
        {
            "name": "재방문율",
            "category": "retention",
            "current_value": 28.5,
            "target_value": 30.0,
            "unit": "%",
            "trend": [25.2, 26.8, 27.5, 28.1, 29.2, 28.5],
            "dates": ['2025-08-01', '2025-08-02', '2025-08-03', '2025-08-04', '2025-08-05', '2025-08-06'],
            "journeyStage": "유지 단계",
            "impact": "high",
            "description": "기존 고객이 다시 방문하는 비율",
            "improvement": "로열티 프로그램 강화, 개인화 서비스 제공"
        }
    ]
    
    # 카테고리 필터
    categories = ["all"] + list(set([kpi["category"] for kpi in kpi_data]))
    selected_category = st.selectbox(
        "카테고리 선택",
        categories,
        index=0,
        format_func=lambda x: {
            "all": "전체",
            "conversion": "전환",
            "engagement": "참여도",
            "retention": "유지"
        }.get(x, x)
    )
    
    # KPI 필터링
    filtered_kpis = kpi_data if selected_category == "all" else [kpi for kpi in kpi_data if kpi["category"] == selected_category]
    
    # KPI 카드들
    for kpi in filtered_kpis:
        with st.expander(f"📊 {kpi['name']} - {kpi['journeyStage']}"):
            col1, col2 = st.columns([2, 1])
            
            with col1:
                # KPI 값과 목표
                st.metric(
                    label=kpi['name'],
                    value=f"{kpi['current_value']}{kpi['unit']}",
                    delta=f"{kpi['current_value'] - kpi['target_value']:+.1f}{kpi['unit']}"
                )
                
                # 설명
                st.write(f"**설명:** {kpi['description']}")
                st.write(f"**개선 방안:** {kpi['improvement']}")
            
            with col2:
                # 트렌드 차트
                fig = go.Figure()
                fig.add_trace(go.Scatter(
                    x=kpi['dates'],
                    y=kpi['trend'],
                    mode='lines+markers',
                    name=kpi['name']
                ))
                fig.update_layout(
                    title=f"{kpi['name']} 트렌드",
                    height=200,
                    showlegend=False
                )
                st.plotly_chart(fig, use_container_width=True)
    
    # 여정 맵 토글
    if st.button("🗺️ 여정 맵 보기/숨기기"):
        st.session_state.show_journey_map = not st.session_state.show_journey_map
    
    # 여정 맵 표시
    if st.session_state.show_journey_map:
        st.subheader("🗺️ 고객 여정 맵 미니 버전")
        fig = create_customer_journey_map()
        if fig:
            st.plotly_chart(fig, use_container_width=True)

def customer_journey_page():
    """고객 여정 맵 페이지"""
    st.markdown('<h1 class="main-header">🗺️ 고객 여정 맵</h1>', unsafe_allow_html=True)
    
    # 필터 옵션
    col1, col2, col3 = st.columns(3)
    
    with col1:
        categories = ["all", "lead_generation", "product_development", "customer_service", "marketing"]
        selected_category = st.selectbox(
            "카테고리 선택",
            categories,
            index=0,
            format_func=lambda x: {
                "all": "전체",
                "lead_generation": "리드 생성",
                "product_development": "제품 개발",
                "customer_service": "고객 서비스",
                "marketing": "마케팅"
            }[x]
        )
    
    with col2:
        start_date = st.date_input(
            "시작일",
            value=datetime.now() - timedelta(days=30)
        )
    
    with col3:
        end_date = st.date_input(
            "종료일",
            value=datetime.now()
        )
    
    # 선택된 필터 정보 표시
    st.info(f"선택된 카테고리: {selected_category}, 기간: {start_date} ~ {end_date}")
    
    # 여정 맵 표시
    fig = create_customer_journey_map()
    if fig:
        st.plotly_chart(fig, use_container_width=True)
    
    # 감정 변화 차트
    st.subheader("📊 감정 변화 분석")
    
    emotions_data = {
        "인지": {"긍정": 65, "중립": 25, "부정": 10},
        "관심": {"긍정": 70, "중립": 20, "부정": 10},
        "고려": {"긍정": 55, "중립": 30, "부정": 15},
        "결정": {"긍정": 80, "중립": 15, "부정": 5},
        "유지": {"긍정": 75, "중립": 20, "부정": 5}
    }
    
    fig = go.Figure()
    
    for stage, emotions in emotions_data.items():
        fig.add_trace(go.Bar(
            name=stage,
            x=list(emotions.keys()),
            y=list(emotions.values()),
            text=list(emotions.values()),
            textposition='auto'
        ))
    
    fig.update_layout(
        title="여정 단계별 감정 분포",
        barmode='group',
        height=400
    )
    
    st.plotly_chart(fig, use_container_width=True)

def settings_page():
    """설정 페이지"""
    st.markdown('<h1 class="main-header">⚙️ 설정</h1>', unsafe_allow_html=True)
    
    # 탭 생성
    tab1, tab2, tab3, tab4 = st.tabs(["일반 설정", "데이터 처리", "알림 설정", "보안 설정"])
    
    with tab1:
        st.subheader("일반 설정")
        
        # 자동 새로고침
        auto_refresh = st.checkbox("자동 새로고침 활성화", value=True)
        if auto_refresh:
            refresh_interval = st.slider("새로고침 간격 (초)", 30, 300, 60)
        
        # 테마 설정
        theme = st.selectbox("테마", ["라이트", "다크"])
        
        # 언어 설정
        language = st.selectbox("언어", ["한국어", "English"])
    
    with tab2:
        st.subheader("데이터 처리 설정")
        
        # 데이터 보관 기간
        retention_days = st.number_input("데이터 보관 기간 (일)", 30, 365, 90)
        
        # 실시간 처리
        real_time_processing = st.checkbox("실시간 데이터 처리", value=True)
        
        # 배치 처리
        batch_processing = st.checkbox("배치 처리 활성화", value=False)
    
    with tab3:
        st.subheader("알림 설정")
        
        # 이메일 알림
        email_notifications = st.checkbox("이메일 알림", value=False)
        if email_notifications:
            email = st.text_input("이메일 주소")
        
        # 웹훅 알림
        webhook_notifications = st.checkbox("웹훅 알림", value=False)
        if webhook_notifications:
            webhook_url = st.text_input("웹훅 URL")
    
    with tab4:
        st.subheader("보안 설정")
        
        # API 키 관리
        st.write("API 키 관리")
        api_key = st.text_input("API 키", type="password")
        
        # 접근 권한
        access_level = st.selectbox("접근 권한", ["읽기 전용", "읽기/쓰기", "관리자"])
    
    # 설정 저장
    if st.button("설정 저장"):
        st.success("설정이 저장되었습니다!")

def main():
    """메인 함수"""
    # 사이드바 네비게이션
    with st.sidebar:
        st.title("📊 고객 분석 시스템")
        
        selected = option_menu(
            "메뉴",
            ["대시보드", "KPI 분석", "고객 여정 맵", "설정"],
            icons=['house', 'graph-up', 'map', 'gear'],
            menu_icon="cast",
            default_index=0,
        )
        
        st.markdown("---")
        st.markdown("### 시스템 상태")
        
        # 백엔드 연결 상태 확인
        if USE_MOCK_DATA:
            st.info("🔄 모의 데이터 모드")
        else:
            try:
                response = requests.get(f"{API_BASE_URL}/dashboard/overview", timeout=5)
                if response.status_code == 200:
                    st.success("✅ 백엔드 연결됨")
                else:
                    st.error("❌ 백엔드 오류")
            except:
                st.error("❌ 백엔드 연결 실패")
        
        st.markdown("---")
        st.markdown("### 빠른 액션")
        
        if st.button("🔄 새로고침"):
            st.rerun()
        
        if st.button("📊 데이터 업데이트"):
            st.info("데이터 업데이트 중...")
            time.sleep(2)
            st.success("데이터가 업데이트되었습니다!")
    
    # 페이지 라우팅
    if selected == "대시보드":
        dashboard_page()
    elif selected == "KPI 분석":
        kpi_analytics_page()
    elif selected == "고객 여정 맵":
        customer_journey_page()
    elif selected == "설정":
        settings_page()

if __name__ == "__main__":
    main()
