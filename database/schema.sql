-- 고객 행동 데이터 분석 시스템 데이터베이스 스키마

-- 사용자 테이블
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- 고객 여정 시나리오 테이블
CREATE TABLE customer_journey_scenarios (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    business_goal TEXT,
    target_audience TEXT,
    customer_persona JSONB, -- 고객 페르소나 정보 (JSON 형태로 저장)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- 여정 단계 테이블
CREATE TABLE journey_stages (
    id SERIAL PRIMARY KEY,
    scenario_id INTEGER REFERENCES customer_journey_scenarios(id) ON DELETE CASCADE,
    stage_name VARCHAR(255) NOT NULL,
    stage_order INTEGER NOT NULL,
    stage_type VARCHAR(100) NOT NULL, -- 'page_view', 'action', 'conversion'
    description TEXT,
    expected_duration_minutes INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 사용자 세션 테이블
CREATE TABLE user_sessions (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) REFERENCES users(user_id),
    session_id VARCHAR(255) UNIQUE NOT NULL,
    started_at TIMESTAMP NOT NULL,
    ended_at TIMESTAMP,
    user_agent TEXT,
    ip_address INET,
    referrer_url TEXT,
    landing_page VARCHAR(500),
    device_type VARCHAR(50),
    browser VARCHAR(100),
    os VARCHAR(100),
    country VARCHAR(100),
    city VARCHAR(100)
);

-- 페이지 뷰 이벤트 테이블
CREATE TABLE page_view_events (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(255) REFERENCES user_sessions(session_id),
    user_id VARCHAR(255) REFERENCES users(user_id),
    page_url VARCHAR(500) NOT NULL,
    page_title VARCHAR(255),
    page_category VARCHAR(100),
    viewed_at TIMESTAMP NOT NULL,
    time_on_page_seconds INTEGER,
    scroll_depth_percentage INTEGER,
    is_bounce BOOLEAN DEFAULT FALSE
);

-- 사용자 액션 이벤트 테이블
CREATE TABLE user_action_events (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(255) REFERENCES user_sessions(session_id),
    user_id VARCHAR(255) REFERENCES users(user_id),
    action_type VARCHAR(100) NOT NULL, -- 'click', 'form_submit', 'purchase', etc.
    action_name VARCHAR(255) NOT NULL,
    element_id VARCHAR(255),
    element_class VARCHAR(255),
    element_text TEXT,
    page_url VARCHAR(500),
    action_data JSONB,
    performed_at TIMESTAMP NOT NULL
);

-- 전환 이벤트 테이블
CREATE TABLE conversion_events (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(255) REFERENCES user_sessions(session_id),
    user_id VARCHAR(255) REFERENCES users(user_id),
    conversion_type VARCHAR(100) NOT NULL, -- 'signup', 'purchase', 'download', etc.
    conversion_value DECIMAL(10,2),
    conversion_currency VARCHAR(3) DEFAULT 'KRW',
    conversion_data JSONB,
    converted_at TIMESTAMP NOT NULL
);

-- 여정 단계 완료 테이블
CREATE TABLE journey_stage_completions (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) REFERENCES users(user_id),
    session_id VARCHAR(255) REFERENCES user_sessions(session_id),
    stage_id INTEGER REFERENCES journey_stages(id),
    scenario_id INTEGER REFERENCES customer_journey_scenarios(id),
    completed_at TIMESTAMP NOT NULL,
    completion_duration_minutes INTEGER,
    is_successful BOOLEAN DEFAULT TRUE,
    failure_reason TEXT
);

-- KPI 정의 테이블
CREATE TABLE kpi_definitions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    calculation_formula TEXT,
    unit VARCHAR(50),
    target_value DECIMAL(10,2),
    min_value DECIMAL(10,2),
    max_value DECIMAL(10,2),
    category VARCHAR(100), -- 'conversion', 'engagement', 'revenue', 'retention'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 시나리오별 KPI 매핑 테이블
CREATE TABLE scenario_kpi_mappings (
    id SERIAL PRIMARY KEY,
    scenario_id INTEGER REFERENCES customer_journey_scenarios(id) ON DELETE CASCADE,
    kpi_id INTEGER REFERENCES kpi_definitions(id) ON DELETE CASCADE,
    is_primary BOOLEAN DEFAULT FALSE,
    weight DECIMAL(3,2) DEFAULT 1.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- KPI 측정값 테이블
CREATE TABLE kpi_measurements (
    id SERIAL PRIMARY KEY,
    kpi_id INTEGER REFERENCES kpi_definitions(id),
    scenario_id INTEGER REFERENCES customer_journey_scenarios(id),
    measured_value DECIMAL(10,4),
    measurement_date DATE NOT NULL,
    measurement_period VARCHAR(20) NOT NULL, -- 'daily', 'weekly', 'monthly'
    data_source VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 대시보드 카드 정의 테이블
CREATE TABLE dashboard_cards (
    id SERIAL PRIMARY KEY,
    card_name VARCHAR(255) NOT NULL,
    card_type VARCHAR(100) NOT NULL, -- 'metric', 'chart', 'funnel', 'table'
    title VARCHAR(255) NOT NULL,
    description TEXT,
    chart_type VARCHAR(100), -- 'line', 'bar', 'pie', 'funnel'
    data_query TEXT,
    refresh_interval_seconds INTEGER DEFAULT 300,
    position_x INTEGER,
    position_y INTEGER,
    width INTEGER DEFAULT 1,
    height INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 대시보드 카드와 시나리오 연결 테이블
CREATE TABLE dashboard_scenario_cards (
    id SERIAL PRIMARY KEY,
    dashboard_card_id INTEGER REFERENCES dashboard_cards(id) ON DELETE CASCADE,
    scenario_id INTEGER REFERENCES customer_journey_scenarios(id) ON DELETE CASCADE,
    card_order INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스 생성
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_started_at ON user_sessions(started_at);
CREATE INDEX idx_page_view_events_session_id ON page_view_events(session_id);
CREATE INDEX idx_page_view_events_viewed_at ON page_view_events(viewed_at);
CREATE INDEX idx_user_action_events_session_id ON user_action_events(session_id);
CREATE INDEX idx_user_action_events_performed_at ON user_action_events(performed_at);
CREATE INDEX idx_conversion_events_user_id ON conversion_events(user_id);
CREATE INDEX idx_conversion_events_converted_at ON conversion_events(converted_at);
CREATE INDEX idx_journey_stage_completions_user_id ON journey_stage_completions(user_id);
CREATE INDEX idx_journey_stage_completions_scenario_id ON journey_stage_completions(scenario_id);
CREATE INDEX idx_kpi_measurements_date ON kpi_measurements(measurement_date);
CREATE INDEX idx_kpi_measurements_scenario_id ON kpi_measurements(scenario_id);

-- 뷰 생성: 고객 여정 퍼널 분석
CREATE VIEW customer_journey_funnel AS
SELECT 
    cjs.name as scenario_name,
    js.stage_name,
    js.stage_order,
    COUNT(DISTINCT jsc.user_id) as users_reached,
    LAG(COUNT(DISTINCT jsc.user_id)) OVER (PARTITION BY cjs.id ORDER BY js.stage_order) as previous_stage_users,
    CASE 
        WHEN LAG(COUNT(DISTINCT jsc.user_id)) OVER (PARTITION BY cjs.id ORDER BY js.stage_order) > 0 
        THEN (COUNT(DISTINCT jsc.user_id)::DECIMAL / LAG(COUNT(DISTINCT jsc.user_id)) OVER (PARTITION BY cjs.id ORDER BY js.stage_order) * 100)::DECIMAL(5,2)
        ELSE 0 
    END as conversion_rate
FROM customer_journey_scenarios cjs
JOIN journey_stages js ON cjs.id = js.scenario_id
LEFT JOIN journey_stage_completions jsc ON js.id = jsc.stage_id AND jsc.is_successful = true
WHERE cjs.is_active = true
GROUP BY cjs.id, cjs.name, js.id, js.stage_name, js.stage_order
ORDER BY cjs.id, js.stage_order;

-- 뷰 생성: 일별 KPI 요약
CREATE VIEW daily_kpi_summary AS
SELECT 
    km.measurement_date,
    cjs.name as scenario_name,
    kd.name as kpi_name,
    kd.category as kpi_category,
    km.measured_value,
    kd.unit,
    kd.target_value
FROM kpi_measurements km
JOIN kpi_definitions kd ON km.kpi_id = kd.id
JOIN customer_journey_scenarios cjs ON km.scenario_id = cjs.id
WHERE km.measurement_period = 'daily'
ORDER BY km.measurement_date DESC, cjs.name, kd.name; 