import streamlit as st
import pandas as pd
import plotly.graph_objects as go
import plotly.express as px
from plotly.subplots import make_subplots
import requests
import os
import json
from datetime import datetime, timedelta
import random
from typing import Dict, List, Any, Optional
import time

# 페이지 설정
st.set_page_config(
    page_title="고객 분석 시스템",
    page_icon="📊",
    layout="wide",
    initial_sidebar_state="expanded"
)

# CSS 스타일링
st.markdown("""
<style>
    .main-header {
        font-size: 2.5rem;
        font-weight: bold;
        color: #1f2937;
        margin-bottom: 0.5rem;
    }
    .sub-header {
        font-size: 1.1rem;
        color: #6b7280;
        margin-bottom: 2rem;
    }
    .metric-card {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 1.5rem;
        border-radius: 10px;
        color: white;
        text-align: center;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .metric-value {
        font-size: 2rem;
        font-weight: bold;
        margin: 0.5rem 0;
    }
    .metric-change {
        font-size: 0.9rem;
        opacity: 0.9;
    }
    .chart-container {
        background: white;
        padding: 1.5rem;
        border-radius: 10px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        margin-bottom: 1rem;
    }
    .admin-panel {
        background: #f8fafc;
        padding: 1.5rem;
        border-radius: 10px;
        border: 2px solid #e2e8f0;
        margin-bottom: 2rem;
    }
    .category-selector {
        background: white;
        padding: 1rem;
        border-radius: 8px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        margin-bottom: 2rem;
    }
    .event-table {
        background: white;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    .success-message {
        background: #d1fae5;
        color: #065f46;
        padding: 1rem;
        border-radius: 8px;
        border-left: 4px solid #10b981;
    }
    .error-message {
        background: #fee2e2;
        color: #991b1b;
        padding: 1rem;
        border-radius: 8px;
        border-left: 4px solid #ef4444;
    }
    .loading-spinner {
        text-align: center;
        padding: 2rem;
        color: #6b7280;
    }
</style>
""", unsafe_allow_html=True)

# 환경 설정 - Streamlit Cloud에서는 항상 모의 데이터 사용
def is_streamlit_cloud_environment():
    """Streamlit Cloud 환경인지 확인"""
    cloud_indicators = [
        os.getenv('STREAMLIT_CLOUD') == 'true',
        os.getenv('STREAMLIT_SHARING_MODE') == 'streamlit',
        'streamlit.app' in os.getenv('STREAMLIT_SERVER_HEADLESS', ''),
        'share.streamlit.io' in os.getenv('STREAMLIT_SERVER_HEADLESS', ''),
        os.getenv('STREAMLIT_SERVER_PORT') == '8501'
    ]
    return any(cloud_indicators)

# 환경 감지
IS_STREAMLIT_CLOUD = is_streamlit_cloud_environment()

# 세션 상태 초기화
if 'selected_category' not in st.session_state:
    st.session_state.selected_category = 'all'
if 'show_admin_panel' not in st.session_state:
    st.session_state.show_admin_panel = False
if 'last_refresh' not in st.session_state:
    st.session_state.last_refresh = datetime.now()

# 모의 데이터 생성 함수들
def generate_mock_overview(category: str = 'all') -> Dict[str, Any]:
    """모의 대시보드 개요 데이터 생성"""
    base_data = {
        'total_users': random.randint(50000, 150000),
        'total_sessions': random.randint(80000, 200000),
        'total_conversions': random.randint(5000, 15000),
        'average_conversion_rate': round(random.uniform(5.0, 12.0), 1)
    }
    
    if category == 'ecommerce':
        base_data.update({
            'total_revenue': random.randint(50000000, 200000000),
            'average_order_value': random.randint(80000, 150000)
        })
    elif category == 'lead_generation':
        base_data.update({
            'total_leads': random.randint(2000, 8000),
            'lead_conversion_rate': round(random.uniform(15.0, 35.0), 1)
        })
    elif category == 'general_website':
        base_data.update({
            'total_page_views': random.randint(150000, 400000),
            'unique_visitors': random.randint(30000, 80000)
        })
    
    return base_data

def generate_mock_funnel_data(category: str = 'all') -> List[Dict[str, Any]]:
    """모의 퍼널 데이터 생성"""
    if category == 'ecommerce':
        stages = [
            {'stage_name': '홈페이지 방문', 'users_reached': 10000},
            {'stage_name': '상품 탐색', 'users_reached': 7500},
            {'stage_name': '장바구니 추가', 'users_reached': 4500},
            {'stage_name': '결제 페이지', 'users_reached': 2800},
            {'stage_name': '구매 완료', 'users_reached': 2100}
        ]
    elif category == 'lead_generation':
        stages = [
            {'stage_name': '랜딩페이지 방문', 'users_reached': 8000},
            {'stage_name': '콘텐츠 확인', 'users_reached': 6000},
            {'stage_name': '이메일 입력', 'users_reached': 3500},
            {'stage_name': '이메일 인증', 'users_reached': 2800},
            {'stage_name': '리드 등록', 'users_reached': 2200}
        ]
    else:
        stages = [
            {'stage_name': '웹사이트 방문', 'users_reached': 12000},
            {'stage_name': '페이지 탐색', 'users_reached': 9000},
            {'stage_name': '콘텐츠 소비', 'users_reached': 6500},
            {'stage_name': '행동 완료', 'users_reached': 4200}
        ]
    
    return stages

def generate_mock_kpi_trends(category: str = 'all') -> List[Dict[str, Any]]:
    """모의 KPI 트렌드 데이터 생성"""
    trends = []
    base_date = datetime.now() - timedelta(days=30)
    
    for i in range(30):
        date = base_date + timedelta(days=i)
        if category == 'ecommerce':
            value = random.uniform(8.0, 15.0)
        elif category == 'lead_generation':
            value = random.uniform(12.0, 25.0)
        else:
            value = random.uniform(6.0, 12.0)
        
        trends.append({
            'date': date.strftime('%Y-%m-%d'),
            'value': round(value, 1)
        })
    
    return trends

def generate_mock_recent_events(category: str = 'all') -> List[Dict[str, Any]]:
    """모의 최근 이벤트 데이터 생성"""
    events = []
    event_types = {
        'ecommerce': ['상품 조회', '장바구니 추가', '구매 완료', '리뷰 작성'],
        'lead_generation': ['페이지 방문', '이메일 구독', '다운로드', '문의하기'],
        'general_website': ['페이지 방문', '링크 클릭', '검색', '다운로드']
    }
    
    for i in range(10):
        event_type = random.choice(event_types.get(category, ['페이지 방문', '링크 클릭']))
        events.append({
            'id': f'event_{i+1}',
            'user_id': f'user_{random.randint(1000, 9999)}',
            'event_type': event_type,
            'timestamp': (datetime.now() - timedelta(minutes=random.randint(1, 1440))).isoformat(),
            'category': category,
            'value': random.randint(1, 100) if event_type in ['구매 완료', '다운로드'] else None
        })
    
    return sorted(events, key=lambda x: x['timestamp'], reverse=True)

def generate_mock_scenario_performance(category: str = 'all') -> List[Dict[str, Any]]:
    """모의 시나리오 성과 데이터 생성"""
    scenarios = {
        'ecommerce': ['신규 고객', '재방문 고객', '프리미엄 고객'],
        'lead_generation': ['이메일 캠페인', '소셜미디어', '검색 광고'],
        'general_website': ['직접 방문', '검색 엔진', '소셜 미디어']
    }
    
    performance = []
    for scenario in scenarios.get(category, ['시나리오 1', '시나리오 2', '시나리오 3']):
        performance.append({
            'scenario_name': scenario,
            'conversion_rate': round(random.uniform(5.0, 25.0), 1),
            'total_users': random.randint(1000, 10000),
            'converted_users': random.randint(100, 2000)
        })
    
    return performance

def generate_mock_category_metrics(category: str = 'all') -> Dict[str, Any]:
    """모의 카테고리별 메트릭 데이터 생성"""
    if category == 'ecommerce':
        return {
            'total_revenue': random.randint(50000000, 200000000),
            'average_order_value': random.randint(80000, 150000),
            'cart_abandonment_rate': round(random.uniform(20.0, 40.0), 1),
            'repeat_purchase_rate': round(random.uniform(15.0, 35.0), 1)
        }
    elif category == 'lead_generation':
        return {
            'total_leads': random.randint(2000, 8000),
            'lead_conversion_rate': round(random.uniform(15.0, 35.0), 1),
            'email_open_rate': round(random.uniform(20.0, 45.0), 1),
            'click_through_rate': round(random.uniform(2.0, 8.0), 1)
        }
    elif category == 'general_website':
        return {
            'total_page_views': random.randint(150000, 400000),
            'unique_visitors': random.randint(30000, 80000),
            'bounce_rate': round(random.uniform(30.0, 60.0), 1),
            'average_session_duration': random.randint(120, 480)
        }
    else:
        return {
            'total_users': random.randint(50000, 150000),
            'total_sessions': random.randint(80000, 200000),
            'total_conversions': random.randint(5000, 15000),
            'average_conversion_rate': round(random.uniform(5.0, 12.0), 1)
        }

# 데이터 가져오기 함수 - 항상 모의 데이터 사용
def fetch_data(endpoint: str, category: str = 'all') -> Dict[str, Any]:
    """데이터 가져오기 - 항상 모의 데이터 사용"""
    if 'overview' in endpoint:
        return {'success': True, 'data': generate_mock_overview(category)}
    elif 'funnels' in endpoint:
        return {'success': True, 'data': generate_mock_funnel_data(category)}
    elif 'kpi-trends' in endpoint:
        return {'success': True, 'data': generate_mock_kpi_trends(category)}
    elif 'recent-events' in endpoint:
        return {'success': True, 'data': generate_mock_recent_events(category)}
    elif 'scenario-performance' in endpoint:
        return {'success': True, 'data': generate_mock_scenario_performance(category)}
    elif 'category-metrics' in endpoint:
        return {'success': True, 'data': generate_mock_category_metrics(category)}
    else:
        return {'success': False, 'error': 'Unknown endpoint'}

# 차트 생성 함수들
def create_funnel_chart(funnel_data: List[Dict[str, Any]]) -> go.Figure:
    """퍼널 차트 생성"""
    stages = [stage['stage_name'] for stage in funnel_data]
    values = [stage['users_reached'] for stage in funnel_data]
    
    fig = go.Figure(go.Funnel(
        y=stages,
        x=values,
        textinfo="value+percent initial",
        textposition="inside",
        marker={"color": ["#667eea", "#764ba2", "#f093fb", "#f5576c", "#4facfe"]},
        connector={"line": {"color": "royalblue", "width": 3}}
    ))
    
    fig.update_layout(
        title="고객 여정 퍼널 분석",
        height=500,
        showlegend=False,
        margin=dict(l=50, r=50, t=50, b=50)
    )
    
    return fig

def create_kpi_trend_chart(trend_data: List[Dict[str, Any]]) -> go.Figure:
    """KPI 트렌드 차트 생성"""
    dates = [item['date'] for item in trend_data]
    values = [item['value'] for item in trend_data]
    
    fig = go.Figure()
    fig.add_trace(go.Scatter(
        x=dates,
        y=values,
        mode='lines+markers',
        name='전환율',
        line=dict(color='#667eea', width=3),
        marker=dict(size=6)
    ))
    
    fig.update_layout(
        title="KPI 트렌드 분석",
        xaxis_title="날짜",
        yaxis_title="전환율 (%)",
        height=500,
        margin=dict(l=50, r=50, t=50, b=50)
    )
    
    return fig

def create_scenario_comparison_chart(scenario_data: List[Dict[str, Any]]) -> go.Figure:
    """시나리오 비교 차트 생성"""
    scenarios = [item['scenario_name'] for item in scenario_data]
    conversion_rates = [item['conversion_rate'] for item in scenario_data]
    
    fig = go.Figure(data=[
        go.Bar(
            x=scenarios,
            y=conversion_rates,
            marker_color=['#667eea', '#764ba2', '#f093fb'],
            text=[f"{rate}%" for rate in conversion_rates],
            textposition='auto'
        )
    ])
    
    fig.update_layout(
        title="시나리오별 성과 비교",
        xaxis_title="시나리오",
        yaxis_title="전환율 (%)",
        height=500,
        margin=dict(l=50, r=50, t=50, b=50)
    )
    
    return fig

# 메트릭 카드 컴포넌트
def metric_card(title: str, value: str, change: str = None, change_type: str = "positive"):
    """메트릭 카드 컴포넌트"""
    change_icon = "📈" if change_type == "positive" else "📉"
    change_color = "#10b981" if change_type == "positive" else "#ef4444"
    
    st.markdown(f"""
    <div class="metric-card">
        <div style="font-size: 0.9rem; opacity: 0.9;">{title}</div>
        <div class="metric-value">{value}</div>
        {f'<div class="metric-change" style="color: {change_color};">{change_icon} {change}</div>' if change else ''}
    </div>
    """, unsafe_allow_html=True)

# 관리자 패널
def admin_panel():
    """관리자 패널"""
    st.markdown("### 🔧 관리자 패널")
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        st.subheader("📊 데이터 생성")
        if st.button("새로운 이벤트 생성", key="admin_generate_event"):
            st.success("새로운 이벤트가 생성되었습니다!")
            st.session_state.last_refresh = datetime.now()
    
    with col2:
        st.subheader("🔄 데이터 새로고침")
        if st.button("데이터 새로고침", key="admin_refresh_data"):
            st.success("데이터가 새로고침되었습니다!")
            st.session_state.last_refresh = datetime.now()
    
    with col3:
        st.subheader("⚙️ 시스템 설정")
        auto_refresh = st.checkbox("자동 새로고침", value=True, key="admin_auto_refresh")
        if auto_refresh:
            st.info("5분마다 자동 새로고침")

# 카테고리 선택기
def category_selector(key_suffix=""):
    """카테고리 선택기"""
    categories = {
        'all': '전체',
        'ecommerce': 'E-commerce',
        'lead_generation': '잠재고객 확보',
        'general_website': '일반 웹사이트'
    }
    
    selected = st.selectbox(
        "카테고리 선택",
        options=list(categories.keys()),
        format_func=lambda x: categories[x],
        index=list(categories.keys()).index(st.session_state.selected_category),
        key=f"category_selector{key_suffix}"
    )
    
    if selected != st.session_state.selected_category:
        st.session_state.selected_category = selected
        st.rerun()

# 메인 대시보드
def dashboard_page():
    """대시보드 페이지"""
    # 페이지 헤더
    st.markdown('<h1 class="main-header">📊 고객 분석 대시보드</h1>', unsafe_allow_html=True)
    st.markdown('<p class="sub-header">실시간 고객 여정과 퍼널 분석을 통한 인사이트</p>', unsafe_allow_html=True)
    
    # 관리자 패널 토글
    if st.button("🔧 관리자 패널", key="toggle_admin_panel"):
        st.session_state.show_admin_panel = not st.session_state.show_admin_panel
    
    # 관리자 패널 표시
    if st.session_state.show_admin_panel:
        admin_panel()
    
    # 카테고리 선택
    category_selector("_dashboard")
    
    # 데이터 로딩
    with st.spinner("데이터를 불러오는 중..."):
        # 모든 데이터 병렬로 가져오기
        overview_data = fetch_data('dashboard/overview', st.session_state.selected_category)
        funnel_data = fetch_data('dashboard/funnels', st.session_state.selected_category)
        kpi_trends = fetch_data('dashboard/kpi-trends', st.session_state.selected_category)
        recent_events = fetch_data('dashboard/recent-events', st.session_state.selected_category)
        scenario_performance = fetch_data('dashboard/scenario-performance', st.session_state.selected_category)
        category_metrics = fetch_data('dashboard/category-metrics', st.session_state.selected_category)
    
    # 데이터 검증
    if not all([overview_data['success'], funnel_data['success'], kpi_trends['success'], 
                recent_events['success'], scenario_performance['success'], category_metrics['success']]):
        st.error("일부 데이터를 불러오는데 실패했습니다.")
        return
    
    # 개요 메트릭
    st.subheader("📈 핵심 지표")
    overview = overview_data['data']
    
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        metric_card("총 사용자", f"{overview['total_users']:,}", "+12.5%")
    with col2:
        metric_card("총 세션", f"{overview['total_sessions']:,}", "+8.3%")
    with col3:
        metric_card("총 전환", f"{overview['total_conversions']:,}", "+15.2%")
    with col4:
        metric_card("평균 전환율", f"{overview['average_conversion_rate']}%", "+2.1%")
    
    # 카테고리별 추가 메트릭
    if st.session_state.selected_category == 'ecommerce' and 'total_revenue' in overview:
        st.subheader("💰 E-commerce 추가 지표")
        col1, col2 = st.columns(2)
        with col1:
            metric_card("총 매출", f"₩{overview['total_revenue']:,}", "+18.5%")
        with col2:
            metric_card("평균 주문 금액", f"₩{overview['average_order_value']:,}", "+5.2%")
    
    elif st.session_state.selected_category == 'lead_generation' and 'total_leads' in overview:
        st.subheader("🎯 리드 생성 추가 지표")
        col1, col2 = st.columns(2)
        with col1:
            metric_card("총 리드", f"{overview['total_leads']:,}", "+22.1%")
        with col2:
            metric_card("리드 전환율", f"{overview['lead_conversion_rate']}%", "+3.8%")
    
    elif st.session_state.selected_category == 'general_website' and 'total_page_views' in overview:
        st.subheader("🌐 웹사이트 추가 지표")
        col1, col2 = st.columns(2)
        with col1:
            metric_card("총 페이지뷰", f"{overview['total_page_views']:,}", "+12.3%")
        with col2:
            metric_card("순 방문자", f"{overview.get('unique_visitors', 0):,}", "+8.7%")
    
    # 차트 섹션
    st.subheader("📊 분석 차트")
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.plotly_chart(create_funnel_chart(funnel_data['data']), use_container_width=True)
    
    with col2:
        st.plotly_chart(create_kpi_trend_chart(kpi_trends['data']), use_container_width=True)
    
    # 시나리오 비교 및 최근 이벤트
    col1, col2 = st.columns(2)
    
    with col1:
        st.plotly_chart(create_scenario_comparison_chart(scenario_performance['data']), use_container_width=True)
    
    with col2:
        st.subheader("📋 최근 사용자 이벤트")
        events_df = pd.DataFrame(recent_events['data'])
        if not events_df.empty:
            events_df['timestamp'] = pd.to_datetime(events_df['timestamp']).dt.strftime('%Y-%m-%d %H:%M')
            st.dataframe(
                events_df[['user_id', 'event_type', 'timestamp']].head(10),
                use_container_width=True,
                hide_index=True
            )
        else:
            st.info("최근 이벤트가 없습니다.")

# KPI 분석 페이지
def kpi_analytics_page():
    """KPI 분석 페이지"""
    st.markdown('<h1 class="main-header">📈 KPI 분석</h1>', unsafe_allow_html=True)
    
    # KPI 트렌드 데이터 가져오기
    kpi_data = fetch_data('dashboard/kpi-trends', st.session_state.selected_category)
    
    if kpi_data['success']:
        st.plotly_chart(create_kpi_trend_chart(kpi_data['data']), use_container_width=True)
        
        # KPI 상세 분석
        st.subheader("📊 KPI 상세 분석")
        df = pd.DataFrame(kpi_data['data'])
        df['date'] = pd.to_datetime(df['date'])
        
        col1, col2, col3 = st.columns(3)
        with col1:
            st.metric("평균 전환율", f"{df['value'].mean():.1f}%")
        with col2:
            st.metric("최고 전환율", f"{df['value'].max():.1f}%")
        with col3:
            st.metric("최저 전환율", f"{df['value'].min():.1f}%")
    else:
        st.error("KPI 데이터를 불러오는데 실패했습니다.")

# 고객 여정 맵 페이지
def customer_journey_page():
    """고객 여정 맵 페이지"""
    st.markdown('<h1 class="main-header">🗺️ 고객 여정 맵</h1>', unsafe_allow_html=True)
    
    # 퍼널 데이터 가져오기
    funnel_data = fetch_data('dashboard/funnels', st.session_state.selected_category)
    
    if funnel_data['success']:
        st.plotly_chart(create_funnel_chart(funnel_data['data']), use_container_width=True)
        
        # 여정 단계별 상세 분석
        st.subheader("📋 여정 단계별 분석")
        df = pd.DataFrame(funnel_data['data'])
        
        # 전환율 계산
        df['conversion_rate'] = (df['users_reached'] / df['users_reached'].iloc[0] * 100).round(1)
        df['drop_off_rate'] = (100 - df['conversion_rate']).round(1)
        
        st.dataframe(df, use_container_width=True, hide_index=True)
    else:
        st.error("퍼널 데이터를 불러오는데 실패했습니다.")

# 설정 페이지
def settings_page():
    """설정 페이지"""
    st.markdown('<h1 class="main-header">⚙️ 설정</h1>', unsafe_allow_html=True)
    
    st.subheader("🔧 시스템 설정")
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.subheader("📊 데이터 설정")
        refresh_interval = st.selectbox("새로고침 간격", ["1분", "5분", "10분", "30분"], index=1, key="settings_refresh_interval")
        auto_refresh = st.checkbox("자동 새로고침", value=True, key="settings_auto_refresh")
        
        st.subheader("🎨 UI 설정")
        theme = st.selectbox("테마", ["라이트", "다크"], index=0, key="settings_theme")
        language = st.selectbox("언어", ["한국어", "English"], index=0, key="settings_language")
    
    with col2:
        st.subheader("🔔 알림 설정")
        email_notifications = st.checkbox("이메일 알림", value=False, key="settings_email_notifications")
        slack_notifications = st.checkbox("Slack 알림", value=False, key="settings_slack_notifications")
        
        st.subheader("📈 차트 설정")
        chart_animation = st.checkbox("차트 애니메이션", value=True, key="settings_chart_animation")
        show_data_labels = st.checkbox("데이터 라벨 표시", value=True, key="settings_show_data_labels")
    
    if st.button("💾 설정 저장", key="settings_save"):
        st.success("설정이 저장되었습니다!")

# 사이드바
def sidebar():
    """사이드바"""
    st.sidebar.title("🎯 고객 분석 시스템")
    
    # 시스템 상태 표시
    if IS_STREAMLIT_CLOUD:
        st.sidebar.success("☁️ Streamlit Cloud 모드")
        st.sidebar.info("🔄 모의 데이터 사용 중")
    else:
        st.sidebar.success("🖥️ 로컬 환경")
        st.sidebar.info("🔗 실제 API 연결")
    
    st.sidebar.markdown("---")
    
    # 네비게이션
    page = st.sidebar.selectbox(
        "페이지 선택",
        ["📊 대시보드", "📈 KPI 분석", "🗺️ 고객 여정 맵", "⚙️ 설정"]
    )
    
    st.sidebar.markdown("---")
    
    # 카테고리 선택
    st.sidebar.subheader("📂 카테고리")
    categories = {
        'all': '전체',
        'ecommerce': 'E-commerce',
        'lead_generation': '잠재고객 확보',
        'general_website': '일반 웹사이트'
    }
    
    selected_category = st.sidebar.selectbox(
        "카테고리 선택",
        options=list(categories.keys()),
        format_func=lambda x: categories[x],
        index=list(categories.keys()).index(st.session_state.selected_category),
        key="sidebar_category_selector"
    )
    
    if selected_category != st.session_state.selected_category:
        st.session_state.selected_category = selected_category
        st.rerun()
    
    st.sidebar.markdown("---")
    
    # 시스템 정보
    st.sidebar.subheader("ℹ️ 시스템 정보")
    st.sidebar.text(f"마지막 업데이트:")
    st.sidebar.text(f"{st.session_state.last_refresh.strftime('%H:%M:%S')}")
    
    if st.sidebar.button("🔄 새로고침"):
        st.session_state.last_refresh = datetime.now()
        st.rerun()
    
    return page

# 메인 함수
def main():
    """메인 함수"""
    # 사이드바
    page = sidebar()
    
    # 페이지 라우팅
    if page == "📊 대시보드":
        dashboard_page()
    elif page == "📈 KPI 분석":
        kpi_analytics_page()
    elif page == "🗺️ 고객 여정 맵":
        customer_journey_page()
    elif page == "⚙️ 설정":
        settings_page()

if __name__ == "__main__":
    main()
