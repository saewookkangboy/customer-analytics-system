// 고객 행동 분석 시스템 타입 정의

export interface User {
  id: number;
  user_id: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  created_at: Date;
  updated_at: Date;
  is_active: boolean;
}

export interface CustomerJourneyScenario {
  id: number;
  name: string;
  description?: string;
  business_goal?: string;
  target_audience?: string;
  created_at: Date;
  updated_at: Date;
  is_active: boolean;
}

export interface JourneyStage {
  id: number;
  scenario_id: number;
  stage_name: string;
  stage_order: number;
  stage_type: 'page_view' | 'action' | 'conversion';
  description?: string;
  expected_duration_minutes?: number;
  created_at: Date;
  updated_at: Date;
}

export interface UserSession {
  id: number;
  user_id?: string;
  session_id: string;
  started_at: Date;
  ended_at?: Date;
  user_agent?: string;
  ip_address?: string;
  referrer_url?: string;
  landing_page?: string;
  device_type?: string;
  browser?: string;
  os?: string;
  country?: string;
  city?: string;
}

export interface PageViewEvent {
  id: number;
  session_id: string;
  user_id?: string;
  page_url: string;
  page_title?: string;
  page_category?: string;
  viewed_at: Date;
  time_on_page_seconds?: number;
  scroll_depth_percentage?: number;
  is_bounce: boolean;
}

export interface UserActionEvent {
  id: number;
  session_id: string;
  user_id?: string;
  action_type: string;
  action_name: string;
  element_id?: string;
  element_class?: string;
  element_text?: string;
  page_url?: string;
  action_data?: Record<string, any>;
  performed_at: Date;
}

export interface ConversionEvent {
  id: number;
  session_id: string;
  user_id?: string;
  conversion_type: string;
  conversion_value?: number;
  conversion_currency: string;
  conversion_data?: Record<string, any>;
  converted_at: Date;
}

export interface JourneyStageCompletion {
  id: number;
  user_id: string;
  session_id: string;
  stage_id: number;
  scenario_id: number;
  completed_at: Date;
  completion_duration_minutes?: number;
  is_successful: boolean;
  failure_reason?: string;
}

export interface KPIDefinition {
  id: number;
  name: string;
  description?: string;
  calculation_formula?: string;
  unit?: string;
  target_value?: number;
  min_value?: number;
  max_value?: number;
  category: 'conversion' | 'engagement' | 'revenue' | 'retention' | 'satisfaction';
  created_at: Date;
  updated_at: Date;
}

export interface KPIMeasurement {
  id: number;
  kpi_id: number;
  scenario_id: number;
  measured_value?: number;
  measurement_date: Date;
  measurement_period: 'daily' | 'weekly' | 'monthly';
  data_source?: string;
  created_at: Date;
}

export interface DashboardCard {
  id: number;
  card_name: string;
  card_type: 'metric' | 'chart' | 'funnel' | 'table';
  title: string;
  description?: string;
  chart_type?: 'line' | 'bar' | 'pie' | 'funnel';
  data_query?: string;
  refresh_interval_seconds: number;
  position_x?: number;
  position_y?: number;
  width: number;
  height: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CustomerJourneyFunnel {
  scenario_name: string;
  stage_name: string;
  stage_order: number;
  users_reached: number;
  previous_stage_users?: number;
  conversion_rate: number;
}

export interface DailyKPISummary {
  measurement_date: Date;
  scenario_name: string;
  kpi_name: string;
  kpi_category: string;
  measured_value?: number;
  unit?: string;
  target_value?: number;
}

// API 요청/응답 타입
export interface CreateScenarioRequest {
  name: string;
  description?: string;
  business_goal?: string;
  target_audience?: string;
}

export interface CreateStageRequest {
  scenario_id: number;
  stage_name: string;
  stage_order: number;
  stage_type: 'page_view' | 'action' | 'conversion';
  description?: string;
  expected_duration_minutes?: number;
}

export interface CreateKPIRequest {
  name: string;
  description?: string;
  calculation_formula?: string;
  unit?: string;
  target_value?: number;
  min_value?: number;
  max_value?: number;
  category: 'conversion' | 'engagement' | 'revenue' | 'retention' | 'satisfaction';
}

export interface TrackEventRequest {
  session_id: string;
  user_id?: string;
  event_type: 'page_view' | 'action' | 'conversion';
  event_data: Record<string, any>;
  timestamp?: Date;
}

export interface DashboardCardRequest {
  card_name: string;
  card_type: 'metric' | 'chart' | 'funnel' | 'table';
  title: string;
  description?: string;
  chart_type?: 'line' | 'bar' | 'pie' | 'funnel';
  data_query?: string;
  refresh_interval_seconds?: number;
  position_x?: number;
  position_y?: number;
  width?: number;
  height?: number;
  scenario_ids?: number[];
}

// API 응답 타입
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp: Date;
  requestId?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// 필터링 및 정렬 타입
export interface FilterOptions {
  start_date?: Date;
  end_date?: Date;
  scenario_id?: number;
  user_id?: string;
  event_type?: string;
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

// 대시보드 데이터 타입
export interface DashboardData {
  overview: {
    total_users: number;
    total_sessions: number;
    total_conversions: number;
    average_conversion_rate: number;
  };
  funnels: CustomerJourneyFunnel[];
  kpi_trends: DailyKPISummary[];
  recent_events: (PageViewEvent | UserActionEvent | ConversionEvent)[];
  scenario_performance: {
    scenario_name: string;
    conversion_rate: number;
    total_users: number;
  }[];
} 