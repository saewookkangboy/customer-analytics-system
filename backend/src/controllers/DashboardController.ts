import { Request, Response } from 'express';
import { ApiResponse } from '../types';
import { DateUtils } from '../utils/dateUtils';

export interface CategoryMetrics {
  ecommerce: {
    total_revenue: number;
    average_order_value: number;
    cart_abandonment_rate: number;
    conversion_rate: number;
    customer_lifetime_value: number;
    repeat_purchase_rate: number;
    product_view_to_purchase_rate: number;
    checkout_completion_rate: number;
  };
  lead_generation: {
    total_leads: number;
    lead_conversion_rate: number;
    cost_per_lead: number;
    lead_quality_score: number;
    form_completion_rate: number;
    email_open_rate: number;
    click_through_rate: number;
    lead_to_customer_rate: number;
  };
  general_website: {
    total_page_views: number;
    unique_visitors: number;
    bounce_rate: number;
    average_session_duration: number;
    pages_per_session: number;
    return_visitor_rate: number;
    mobile_traffic_percentage: number;
    top_exit_pages: string[];
  };
}

export class DashboardController {
  // 카테고리별 지표 조회
  static async getCategoryMetrics(req: Request, res: Response): Promise<void> {
    try {
      const { category } = req.query;
      
      const categoryMetrics: CategoryMetrics = {
        ecommerce: {
          total_revenue: 1250000,
          average_order_value: 85.50,
          cart_abandonment_rate: 68.5,
          conversion_rate: 2.8,
          customer_lifetime_value: 450.00,
          repeat_purchase_rate: 35.2,
          product_view_to_purchase_rate: 12.5,
          checkout_completion_rate: 31.5
        },
        lead_generation: {
          total_leads: 2840,
          lead_conversion_rate: 15.8,
          cost_per_lead: 25.50,
          lead_quality_score: 7.8,
          form_completion_rate: 42.3,
          email_open_rate: 28.5,
          click_through_rate: 4.2,
          lead_to_customer_rate: 8.5
        },
        general_website: {
          total_page_views: 45600,
          unique_visitors: 12340,
          bounce_rate: 42.8,
          average_session_duration: 185,
          pages_per_session: 3.7,
          return_visitor_rate: 28.5,
          mobile_traffic_percentage: 58.3,
          top_exit_pages: ['/product/123', '/checkout', '/contact']
        }
      };

      let responseData;
      if (category && typeof category === 'string' && category in categoryMetrics) {
        responseData = { [category as keyof CategoryMetrics]: categoryMetrics[category as keyof CategoryMetrics] };
      } else {
        responseData = categoryMetrics;
      }

      const response: ApiResponse = {
        success: true,
        data: responseData,
        message: '카테고리별 지표를 성공적으로 조회했습니다.',
        timestamp: new Date()
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('카테고리별 지표 조회 오류:', error);
      
      const response: ApiResponse = {
        success: false,
        error: '카테고리별 지표 조회 중 오류가 발생했습니다.',
        timestamp: new Date()
      };
      
      res.status(500).json(response);
    }
  }

  // 대시보드 개요 데이터 조회
  static async getOverview(req: Request, res: Response): Promise<void> {
    try {
      const { category } = req.query;
      
      let overview;
      
      switch (category) {
        case 'ecommerce':
          overview = {
            total_users: 15420,
            total_sessions: 28450,
            total_conversions: 3240,
            average_conversion_rate: 11.4,
            total_revenue: 1250000,
            average_order_value: 85.50
          };
          break;
        case 'lead_generation':
          overview = {
            total_users: 12340,
            total_sessions: 18920,
            total_conversions: 2840,
            average_conversion_rate: 15.0,
            total_leads: 2840,
            lead_conversion_rate: 15.8
          };
          break;
        case 'general_website':
          overview = {
            total_users: 18920,
            total_sessions: 45600,
            total_conversions: 1892,
            average_conversion_rate: 4.1,
            total_page_views: 45600,
            unique_visitors: 12340
          };
          break;
        default:
          overview = {
            total_users: 15420,
            total_sessions: 28450,
            total_conversions: 3240,
            average_conversion_rate: 11.4
          };
      }

      const response: ApiResponse = {
        success: true,
        data: overview,
        message: '대시보드 개요 데이터를 성공적으로 조회했습니다.',
        timestamp: new Date()
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('대시보드 개요 조회 오류:', error);
      
      const response: ApiResponse = {
        success: false,
        error: '대시보드 개요 조회 중 오류가 발생했습니다.',
        timestamp: new Date()
      };
      
      res.status(500).json(response);
    }
  }

  // 퍼널 데이터 조회
  static async getFunnels(req: Request, res: Response): Promise<void> {
    try {
      const { scenario_id, category } = req.query;
      
      let funnels;
      
      switch (category) {
        case 'ecommerce':
          funnels = [
            {
              scenario_name: 'E-commerce 구매 여정',
              stage_name: '상품 페이지 방문',
              stage_order: 1,
              users_reached: 1000,
              conversion_rate: 100
            },
            {
              scenario_name: 'E-commerce 구매 여정',
              stage_name: '장바구니 추가',
              stage_order: 2,
              users_reached: 650,
              conversion_rate: 65
            },
            {
              scenario_name: 'E-commerce 구매 여정',
              stage_name: '결제 페이지 진입',
              stage_order: 3,
              users_reached: 450,
              conversion_rate: 69
            },
            {
              scenario_name: 'E-commerce 구매 여정',
              stage_name: '결제 완료',
              stage_order: 4,
              users_reached: 315,
              conversion_rate: 70
            }
          ];
          break;
        case 'lead_generation':
          funnels = [
            {
              scenario_name: '잠재고객 확보 여정',
              stage_name: '랜딩 페이지 방문',
              stage_order: 1,
              users_reached: 1000,
              conversion_rate: 100
            },
            {
              scenario_name: '잠재고객 확보 여정',
              stage_name: '콘텐츠 소비',
              stage_order: 2,
              users_reached: 750,
              conversion_rate: 75
            },
            {
              scenario_name: '잠재고객 확보 여정',
              stage_name: '리드 폼 노출',
              stage_order: 3,
              users_reached: 500,
              conversion_rate: 67
            },
            {
              scenario_name: '잠재고객 확보 여정',
              stage_name: '리드 제출 완료',
              stage_order: 4,
              users_reached: 158,
              conversion_rate: 32
            }
          ];
          break;
        case 'general_website':
          funnels = [
            {
              scenario_name: '일반 웹사이트 여정',
              stage_name: '홈페이지 방문',
              stage_order: 1,
              users_reached: 1000,
              conversion_rate: 100
            },
            {
              scenario_name: '일반 웹사이트 여정',
              stage_name: '콘텐츠 페이지 방문',
              stage_order: 2,
              users_reached: 800,
              conversion_rate: 80
            },
            {
              scenario_name: '일반 웹사이트 여정',
              stage_name: '연락처 페이지 방문',
              stage_order: 3,
              users_reached: 400,
              conversion_rate: 50
            },
            {
              scenario_name: '일반 웹사이트 여정',
              stage_name: '연락처 정보 입력',
              stage_order: 4,
              users_reached: 41,
              conversion_rate: 10
            }
          ];
          break;
        default:
          funnels = [
            {
              scenario_name: '신규 사용자 온보딩',
              stage_name: '홈페이지 방문',
              stage_order: 1,
              users_reached: 1000,
              conversion_rate: 100
            },
            {
              scenario_name: '신규 사용자 온보딩',
              stage_name: '상품 탐색',
              stage_order: 2,
              users_reached: 750,
              conversion_rate: 75
            },
            {
              scenario_name: '신규 사용자 온보딩',
              stage_name: '장바구니 추가',
              stage_order: 3,
              users_reached: 450,
              conversion_rate: 60
            },
            {
              scenario_name: '신규 사용자 온보딩',
              stage_name: '결제 완료',
              stage_order: 4,
              users_reached: 225,
              conversion_rate: 50
            }
          ];
      }

      const response: ApiResponse = {
        success: true,
        data: funnels,
        message: '퍼널 데이터를 성공적으로 조회했습니다.',
        timestamp: new Date()
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('퍼널 데이터 조회 오류:', error);
      
      const response: ApiResponse = {
        success: false,
        error: '퍼널 데이터 조회 중 오류가 발생했습니다.',
        timestamp: new Date()
      };
      
      res.status(500).json(response);
    }
  }

  // KPI 트렌드 데이터 조회
  static async getKPITrends(req: Request, res: Response): Promise<void> {
    try {
      const { metric, period, category } = req.query;
      
      let kpiTrends;
      
      // 현재 날짜 기준으로 최근 5일간의 날짜 생성
      const dates = DateUtils.getDateRange(5);
      
      switch (category) {
        case 'ecommerce':
          kpiTrends = [
            { date: dates[0], value: 2.1, revenue: 85000 },
            { date: dates[1], value: 2.3, revenue: 92000 },
            { date: dates[2], value: 2.8, revenue: 115000 },
            { date: dates[3], value: 2.5, revenue: 98000 },
            { date: dates[4], value: 3.2, revenue: 125000 }
          ];
          break;
        case 'lead_generation':
          kpiTrends = [
            { date: dates[0], value: 12.5, leads: 180 },
            { date: dates[1], value: 14.2, leads: 220 },
            { date: dates[2], value: 15.8, leads: 250 },
            { date: dates[3], value: 13.8, leads: 200 },
            { date: dates[4], value: 16.5, leads: 280 }
          ];
          break;
        case 'general_website':
          kpiTrends = [
            { date: dates[0], value: 3.8, page_views: 8500 },
            { date: dates[1], value: 4.1, page_views: 9200 },
            { date: dates[2], value: 4.5, page_views: 10500 },
            { date: dates[3], value: 4.2, page_views: 9800 },
            { date: dates[4], value: 4.8, page_views: 11500 }
          ];
          break;
        default:
          kpiTrends = [
            { date: dates[0], value: 10.2 },
            { date: dates[1], value: 11.1 },
            { date: dates[2], value: 12.3 },
            { date: dates[3], value: 11.8 },
            { date: dates[4], value: 13.2 }
          ];
      }

      const response: ApiResponse = {
        success: true,
        data: kpiTrends,
        message: 'KPI 트렌드 데이터를 성공적으로 조회했습니다.',
        timestamp: new Date()
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('KPI 트렌드 조회 오류:', error);
      
      const response: ApiResponse = {
        success: false,
        error: 'KPI 트렌드 조회 중 오류가 발생했습니다.',
        timestamp: new Date()
      };
      
      res.status(500).json(response);
    }
  }

  // 최근 이벤트 데이터 조회
  static async getRecentEvents(req: Request, res: Response): Promise<void> {
    try {
      const { limit = '10', category } = req.query;
      
      // 현재 날짜 기준으로 최근 3일간의 랜덤 시간대 날짜 생성
      const recentDates = DateUtils.getRandomTimeDateRange(3, 4);
      
      let recentEvents;
      
      switch (category) {
        case 'ecommerce':
          recentEvents = [
            { user_id: 'user_001', action_type: 'product_view', performed_at: recentDates[0] },
            { user_id: 'user_002', action_type: 'add_to_cart', performed_at: recentDates[1] },
            { user_id: 'user_003', action_type: 'purchase', performed_at: recentDates[2] },
            { user_id: 'user_004', action_type: 'checkout_start', performed_at: recentDates[3] }
          ];
          break;
        case 'lead_generation':
          recentEvents = [
            { user_id: 'user_001', action_type: 'form_view', performed_at: recentDates[0] },
            { user_id: 'user_002', action_type: 'lead_submit', performed_at: recentDates[1] },
            { user_id: 'user_003', action_type: 'email_open', performed_at: recentDates[2] },
            { user_id: 'user_004', action_type: 'content_download', performed_at: recentDates[3] }
          ];
          break;
        case 'general_website':
          recentEvents = [
            { user_id: 'user_001', action_type: 'page_view', performed_at: recentDates[0] },
            { user_id: 'user_002', action_type: 'contact_form', performed_at: recentDates[1] },
            { user_id: 'user_003', action_type: 'newsletter_signup', performed_at: recentDates[2] },
            { user_id: 'user_004', action_type: 'about_page', performed_at: recentDates[3] }
          ];
          break;
        default:
          recentEvents = [
            { user_id: 'user_001', action_type: 'page_view', performed_at: recentDates[0] },
            { user_id: 'user_002', action_type: 'purchase', performed_at: recentDates[1] },
            { user_id: 'user_003', action_type: 'signup', performed_at: recentDates[2] }
          ];
      }

      const response: ApiResponse = {
        success: true,
        data: recentEvents,
        message: '최근 이벤트 데이터를 성공적으로 조회했습니다.',
        timestamp: new Date()
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('최근 이벤트 조회 오류:', error);
      
      const response: ApiResponse = {
        success: false,
        error: '최근 이벤트 조회 중 오류가 발생했습니다.',
        timestamp: new Date()
      };
      
      res.status(500).json(response);
    }
  }

  // 시나리오 성과 데이터 조회
  static async getScenarioPerformance(req: Request, res: Response): Promise<void> {
    try {
      const { category } = req.query;
      
      let scenarioPerformance;
      
      switch (category) {
        case 'ecommerce':
          scenarioPerformance = [
            { scenario_name: '신규 고객 구매', conversion_rate: 2.8, total_users: 1000, revenue: 85000 },
            { scenario_name: '기존 고객 재구매', conversion_rate: 15.2, total_users: 800, revenue: 120000 },
            { scenario_name: '장바구니 복구', conversion_rate: 8.5, total_users: 200, revenue: 15000 }
          ];
          break;
        case 'lead_generation':
          scenarioPerformance = [
            { scenario_name: '웨비나 등록', conversion_rate: 25.5, total_users: 500, leads: 128 },
            { scenario_name: '백서 다운로드', conversion_rate: 18.2, total_users: 800, leads: 146 },
            { scenario_name: '데모 신청', conversion_rate: 12.8, total_users: 300, leads: 38 }
          ];
          break;
        case 'general_website':
          scenarioPerformance = [
            { scenario_name: '홈페이지 방문', conversion_rate: 4.1, total_users: 2000, page_views: 8200 },
            { scenario_name: '서비스 소개', conversion_rate: 8.5, total_users: 800, page_views: 3400 },
            { scenario_name: '연락처 문의', conversion_rate: 2.3, total_users: 400, page_views: 920 }
          ];
          break;
        default:
          scenarioPerformance = [
            { scenario_name: '신규 사용자 온보딩', conversion_rate: 22.5, total_users: 1000 },
            { scenario_name: '기존 사용자 재구매', conversion_rate: 35.2, total_users: 800 },
            { scenario_name: '고객 서비스 문의', conversion_rate: 85.7, total_users: 200 }
          ];
      }

      const response: ApiResponse = {
        success: true,
        data: scenarioPerformance,
        message: '시나리오 성과 데이터를 성공적으로 조회했습니다.',
        timestamp: new Date()
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('시나리오 성과 조회 오류:', error);
      
      const response: ApiResponse = {
        success: false,
        error: '시나리오 성과 조회 중 오류가 발생했습니다.',
        timestamp: new Date()
      };
      
      res.status(500).json(response);
    }
  }
} 