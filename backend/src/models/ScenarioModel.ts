import { ApiResponse } from '@/types';
import { DateUtils } from '../utils/dateUtils';

export interface CustomerPersona {
  age_range: string;
  gender: string;
  characteristics: string;
  interests: string;
  pain_points: string;
  goals: string;
  behavior_patterns: string;
}

export interface Scenario {
  id: number;
  name: string;
  description: string;
  business_goal: string;
  target_audience: string;
  customer_persona?: CustomerPersona;
  created_at: string;
  is_active: boolean;
}

export interface CreateScenarioData {
  name: string;
  description: string;
  business_goal: string;
  target_audience: string;
  customer_persona?: CustomerPersona;
}

export interface UpdateScenarioData {
  name?: string;
  description?: string;
  business_goal?: string;
  target_audience?: string;
  customer_persona?: CustomerPersona;
  is_active?: boolean;
}

export class ScenarioModel {
  private static scenarios: Scenario[] = [];

  // 초기화 시 시나리오 데이터 생성
  static {
    this.scenarios = this.generateScenarios();
  }

  // 시나리오 데이터를 동적으로 생성하는 메서드
  private static generateScenarios(): Scenario[] {
    const dates = DateUtils.getISODateRange(3);
    
    return [
      {
        id: 1,
        name: '신규 사용자 온보딩',
        description: '신규 사용자의 첫 방문부터 첫 구매까지의 여정',
        business_goal: '신규 사용자 전환율 15% 달성',
        target_audience: '신규 방문자',
        customer_persona: {
          age_range: '25-35세',
          gender: '남성/여성',
          characteristics: '디지털 네이티브, 온라인 쇼핑 선호',
          interests: '새로운 제품, 할인 혜택',
          pain_points: '제품 신뢰성, 배송 시간',
          goals: '합리적인 가격으로 좋은 제품 구매',
          behavior_patterns: '리뷰를 중시, 비교 쇼핑 선호'
        },
        created_at: dates[0] || new Date().toISOString(),
        is_active: true
      },
      {
        id: 2,
        name: '기존 사용자 재구매',
        description: '로그인한 사용자의 재구매 여정',
        business_goal: '재구매율 25% 달성',
        target_audience: '기존 회원',
        customer_persona: {
          age_range: '30-45세',
          gender: '남성/여성',
          characteristics: '충성 고객, 브랜드 신뢰',
          interests: '신제품 알림, VIP 혜택',
          pain_points: '재고 부족, 가격 변동',
          goals: '편리하고 빠른 재구매',
          behavior_patterns: '즉시 구매, 추천 제품 선호'
        },
        created_at: dates[1] || new Date().toISOString(),
        is_active: true
      },
      {
        id: 3,
        name: '고객 서비스 문의',
        description: '고객 문의부터 해결까지의 여정',
        business_goal: '고객 만족도 90% 달성',
        target_audience: '모든 사용자',
        customer_persona: {
          age_range: '20-60세',
          gender: '남성/여성',
          characteristics: '문제 해결 필요, 빠른 응답 원함',
          interests: '정확한 정보, 신속한 해결',
          pain_points: '응답 지연, 불명확한 답변',
          goals: '문제의 빠른 해결과 만족스러운 서비스',
          behavior_patterns: '여러 채널 시도, 상세한 설명 요구'
        },
        created_at: dates[2] || new Date().toISOString(),
        is_active: true
      }
    ];
  }

  private static nextId = 4;

  // 시나리오 생성
  static async create(data: CreateScenarioData): Promise<Scenario> {
    const newScenario: Scenario = {
      id: this.nextId++,
      ...data,
      created_at: new Date().toISOString(),
      is_active: true
    };
    
    this.scenarios.push(newScenario);
    return newScenario;
  }

  // 모든 시나리오 조회
  static async findAll(activeOnly: boolean = true): Promise<Scenario[]> {
    if (activeOnly) {
      return this.scenarios.filter(s => s.is_active);
    }
    return this.scenarios;
  }

  // ID로 시나리오 조회
  static async findById(id: number): Promise<Scenario | null> {
    return this.scenarios.find(s => s.id === id) || null;
  }

  // 시나리오와 단계 정보 함께 조회
  static async findWithStages(id: number): Promise<Scenario | null> {
    return this.findById(id);
  }

  // 시나리오 업데이트
  static async update(id: number, data: UpdateScenarioData): Promise<Scenario | null> {
    const index = this.scenarios.findIndex(s => s.id === id);
    if (index === -1) return null;
    
    const updatedScenario = { ...this.scenarios[index], ...data } as Scenario;
    this.scenarios[index] = updatedScenario;
    return updatedScenario;
  }

  // 시나리오 삭제
  static async delete(id: number): Promise<boolean> {
    const index = this.scenarios.findIndex(s => s.id === id);
    if (index === -1) return false;
    
    if (this.scenarios[index]) {
      this.scenarios[index].is_active = false;
    }
    return true;
  }

  // 시나리오 성과 통계 조회
  static async getPerformanceStats(id: number, startDate?: Date, endDate?: Date): Promise<any> {
    return {
      total_users: 1000,
      conversion_rate: 22.5,
      average_session_duration: 245,
      revenue_per_user: 45.67
    };
  }

  // 시나리오 퍼널 데이터 조회
  static async getFunnelData(id: number, startDate?: Date, endDate?: Date): Promise<any[]> {
    return [
      {
        stage_name: '홈페이지 방문',
        stage_order: 1,
        users_reached: 1000,
        conversion_rate: 100
      },
      {
        stage_name: '상품 탐색',
        stage_order: 2,
        users_reached: 750,
        conversion_rate: 75
      },
      {
        stage_name: '장바구니 추가',
        stage_order: 3,
        users_reached: 450,
        conversion_rate: 60
      },
      {
        stage_name: '결제 완료',
        stage_order: 4,
        users_reached: 225,
        conversion_rate: 50
      }
    ];
  }

  // 시나리오 드롭아웃 분석 조회
  static async getDropoutAnalysis(id: number, startDate?: Date, endDate?: Date): Promise<any> {
    return {
      total_dropouts: 775,
      dropout_rate: 77.5,
      dropout_stages: [
        { stage: '상품 탐색', dropouts: 250, rate: 25 },
        { stage: '장바구니 추가', dropouts: 225, rate: 22.5 },
        { stage: '결제 완료', dropouts: 225, rate: 22.5 }
      ]
    };
  }
} 