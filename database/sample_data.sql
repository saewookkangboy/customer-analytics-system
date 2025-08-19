-- 고객 행동 분석 시스템 샘플 데이터

-- 사용자 샘플 데이터
INSERT INTO users (user_id, email, first_name, last_name) VALUES
('user_001', 'kim.john@email.com', '김', '존'),
('user_002', 'lee.sarah@email.com', '이', '사라'),
('user_003', 'park.mike@email.com', '박', '마이크'),
('user_004', 'choi.emma@email.com', '최', '엠마'),
('user_005', 'jung.david@email.com', '정', '데이비드'),
('user_006', 'yoon.lisa@email.com', '윤', '리사'),
('user_007', 'han.tom@email.com', '한', '톰'),
('user_008', 'kang.anna@email.com', '강', '안나'),
('user_009', 'shin.peter@email.com', '신', '피터'),
('user_010', 'oh.maria@email.com', '오', '마리아');

-- 고객 여정 시나리오 샘플 데이터
INSERT INTO customer_journey_scenarios (name, description, business_goal, target_audience) VALUES
('신규 사용자 온보딩', '신규 사용자의 첫 방문부터 첫 구매까지의 여정', '신규 사용자 전환율 15% 달성', '신규 방문자'),
('기존 사용자 재구매', '로그인한 사용자의 재구매 여정', '재구매율 25% 달성', '기존 회원'),
('고객 서비스 문의', '고객 문의부터 해결까지의 여정', '고객 만족도 90% 달성', '모든 사용자'),
('모바일 앱 다운로드', '웹사이트 방문부터 앱 다운로드까지', '앱 다운로드율 10% 달성', '모바일 사용자'),
('프리미엄 서비스 업그레이드', '무료 사용자의 프리미엄 서비스 전환', '업그레이드율 5% 달성', '무료 사용자');

-- 여정 단계 샘플 데이터 (신규 사용자 온보딩)
INSERT INTO journey_stages (scenario_id, stage_name, stage_order, stage_type, description, expected_duration_minutes) VALUES
(1, '홈페이지 방문', 1, 'page_view', '사용자가 홈페이지에 처음 방문', 2),
(1, '상품 카테고리 탐색', 2, 'page_view', '사용자가 상품 카테고리를 탐색', 5),
(1, '상품 상세 페이지', 3, 'page_view', '사용자가 특정 상품을 자세히 살펴봄', 3),
(1, '장바구니 추가', 4, 'action', '사용자가 상품을 장바구니에 추가', 1),
(1, '회원가입', 5, 'action', '사용자가 회원가입을 완료', 3),
(1, '결제 페이지', 6, 'page_view', '사용자가 결제 페이지에 진입', 2),
(1, '결제 완료', 7, 'conversion', '사용자가 결제를 완료', 1);

-- 여정 단계 샘플 데이터 (기존 사용자 재구매)
INSERT INTO journey_stages (scenario_id, stage_name, stage_order, stage_type, description, expected_duration_minutes) VALUES
(2, '로그인', 1, 'action', '사용자가 로그인', 1),
(2, '상품 추천 페이지', 2, 'page_view', '사용자가 개인화된 상품 추천을 확인', 3),
(2, '상품 검색', 3, 'action', '사용자가 원하는 상품을 검색', 2),
(2, '상품 비교', 4, 'page_view', '사용자가 여러 상품을 비교', 4),
(2, '장바구니 추가', 5, 'action', '사용자가 상품을 장바구니에 추가', 1),
(2, '결제 완료', 6, 'conversion', '사용자가 결제를 완료', 2);

-- 여정 단계 샘플 데이터 (고객 서비스 문의)
INSERT INTO journey_stages (scenario_id, stage_name, stage_order, stage_type, description, expected_duration_minutes) VALUES
(3, '고객센터 접속', 1, 'page_view', '사용자가 고객센터 페이지에 접속', 1),
(3, 'FAQ 검색', 2, 'action', '사용자가 FAQ에서 답변을 찾아봄', 3),
(3, '문의 접수', 3, 'action', '사용자가 문의를 접수', 5),
(3, '상담 진행', 4, 'action', '고객 상담이 진행됨', 15),
(3, '해결 완료', 5, 'conversion', '문의가 해결됨', 1),
(3, '만족도 조사', 6, 'action', '사용자가 만족도 조사에 참여', 2);

-- KPI 정의 샘플 데이터
INSERT INTO kpi_definitions (name, description, calculation_formula, unit, target_value, min_value, max_value, category) VALUES
('전환율', '각 단계별 사용자 전환율', '완료된 사용자 수 / 시작한 사용자 수 * 100', '%', 15.0, 0.0, 100.0, 'conversion'),
('드롭아웃율', '각 단계에서 이탈하는 사용자 비율', '이탈한 사용자 수 / 시작한 사용자 수 * 100', '%', 10.0, 0.0, 100.0, 'conversion'),
('평균 체류시간', '페이지별 평균 체류 시간', '총 체류시간 / 페이지 뷰 수', '초', 180.0, 0.0, 3600.0, 'engagement'),
('재방문율', '30일 내 재방문하는 사용자 비율', '재방문 사용자 수 / 총 사용자 수 * 100', '%', 30.0, 0.0, 100.0, 'retention'),
('고객 생애 가치', '고객 한 명당 평균 수익', '총 수익 / 고객 수', '원', 50000.0, 0.0, 1000000.0, 'revenue'),
('만족도 점수', '고객 만족도 조사 평균 점수', '만족도 점수 합계 / 응답 수', '점', 4.5, 1.0, 5.0, 'satisfaction'),
('페이지 뷰 수', '페이지별 방문자 수', '페이지 뷰 이벤트 수', '회', 1000.0, 0.0, 100000.0, 'engagement'),
('이탈률', '페이지를 떠나는 사용자 비율', '이탈한 사용자 수 / 방문한 사용자 수 * 100', '%', 20.0, 0.0, 100.0, 'engagement');

-- 시나리오별 KPI 매핑 샘플 데이터
INSERT INTO scenario_kpi_mappings (scenario_id, kpi_id, is_primary, weight) VALUES
-- 신규 사용자 온보딩
(1, 1, TRUE, 1.0),   -- 전환율
(1, 2, FALSE, 0.8),  -- 드롭아웃율
(1, 3, FALSE, 0.6),  -- 평균 체류시간
(1, 5, FALSE, 0.9),  -- 고객 생애 가치

-- 기존 사용자 재구매
(2, 1, TRUE, 1.0),   -- 전환율
(2, 4, FALSE, 0.9),  -- 재방문율
(2, 5, FALSE, 1.0),  -- 고객 생애 가치

-- 고객 서비스 문의
(3, 1, TRUE, 1.0),   -- 전환율
(3, 6, FALSE, 0.9),  -- 만족도 점수
(3, 3, FALSE, 0.5),  -- 평균 체류시간

-- 모바일 앱 다운로드
(4, 1, TRUE, 1.0),   -- 전환율
(4, 7, FALSE, 0.7),  -- 페이지 뷰 수

-- 프리미엄 서비스 업그레이드
(5, 1, TRUE, 1.0),   -- 전환율
(5, 5, FALSE, 1.0),  -- 고객 생애 가치
(5, 4, FALSE, 0.8);  -- 재방문율

-- 대시보드 카드 정의 샘플 데이터
INSERT INTO dashboard_cards (card_name, card_type, title, description, chart_type, data_query, refresh_interval_seconds, position_x, position_y, width, height) VALUES
('overview_metrics', 'metric', '전체 전환율', '모든 시나리오의 평균 전환율', NULL, 'SELECT AVG(measured_value) FROM kpi_measurements WHERE kpi_id = 1', 300, 0, 0, 2, 1),
('funnel_chart', 'chart', '고객 여정 퍼널', '신규 사용자 온보딩 퍼널 분석', 'funnel', 'SELECT * FROM customer_journey_funnel WHERE scenario_name = ''신규 사용자 온보딩''', 300, 0, 1, 3, 2),
('kpi_trend', 'chart', 'KPI 트렌드', '주요 KPI의 시간별 변화', 'line', 'SELECT * FROM daily_kpi_summary WHERE kpi_name = ''전환율'' ORDER BY measurement_date DESC LIMIT 30', 300, 3, 0, 3, 2),
('scenario_comparison', 'chart', '시나리오 비교', '각 시나리오별 성과 비교', 'bar', 'SELECT scenario_name, AVG(measured_value) as avg_value FROM daily_kpi_summary GROUP BY scenario_name', 300, 0, 3, 3, 2),
('realtime_events', 'table', '실시간 이벤트', '최근 사용자 행동 이벤트', 'table', 'SELECT user_id, action_type, performed_at FROM user_action_events ORDER BY performed_at DESC LIMIT 10', 60, 3, 3, 3, 2);

-- 대시보드 카드와 시나리오 연결 샘플 데이터
INSERT INTO dashboard_scenario_cards (dashboard_card_id, scenario_id, card_order) VALUES
(1, 1, 1),  -- 전체 전환율 - 신규 사용자 온보딩
(2, 1, 2),  -- 퍼널 차트 - 신규 사용자 온보딩
(3, 1, 3),  -- KPI 트렌드 - 신규 사용자 온보딩
(1, 2, 1),  -- 전체 전환율 - 기존 사용자 재구매
(4, 2, 2),  -- 시나리오 비교 - 기존 사용자 재구매
(1, 3, 1),  -- 전체 전환율 - 고객 서비스 문의
(5, 3, 2);  -- 실시간 이벤트 - 고객 서비스 문의 