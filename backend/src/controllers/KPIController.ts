import { Request, Response } from 'express';
import { ApiResponse } from '../types';

export class KPIController {
  // KPI 메트릭 조회
  static async getMetrics(req: Request, res: Response): Promise<void> {
    try {
      const { period, scenario_id } = req.query;
      
      const metrics = {
        conversion_rate: 11.4,
        average_session_duration: 245,
        bounce_rate: 32.1,
        revenue_per_user: 45.67
      };

      const response: ApiResponse = {
        success: true,
        data: metrics,
        message: 'KPI 메트릭을 성공적으로 조회했습니다.',
        timestamp: new Date()
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('KPI 메트릭 조회 오류:', error);
      
      const response: ApiResponse = {
        success: false,
        error: 'KPI 메트릭 조회 중 오류가 발생했습니다.',
        timestamp: new Date()
      };
      
      res.status(500).json(response);
    }
  }

  // KPI 트렌드 조회
  static async getTrends(req: Request, res: Response): Promise<void> {
    try {
      const { metric, period } = req.query;
      
      const trends = [
        { date: '2024-01-01', value: 10.2 },
        { date: '2024-01-02', value: 11.1 },
        { date: '2024-01-03', value: 12.3 },
        { date: '2024-01-04', value: 11.8 },
        { date: '2024-01-05', value: 13.2 }
      ];

      const response: ApiResponse = {
        success: true,
        data: trends,
        message: 'KPI 트렌드를 성공적으로 조회했습니다.',
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

  // KPI 비교 조회
  static async getComparison(req: Request, res: Response): Promise<void> {
    try {
      const { baseline_period, comparison_period } = req.query;
      
      const comparison = {
        conversion_rate: {
          baseline: 10.2,
          comparison: 11.4,
          change: 11.8
        },
        average_session_duration: {
          baseline: 230,
          comparison: 245,
          change: 6.5
        },
        bounce_rate: {
          baseline: 35.2,
          comparison: 32.1,
          change: -8.8
        }
      };

      const response: ApiResponse = {
        success: true,
        data: comparison,
        message: 'KPI 비교 데이터를 성공적으로 조회했습니다.',
        timestamp: new Date()
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('KPI 비교 조회 오류:', error);
      
      const response: ApiResponse = {
        success: false,
        error: 'KPI 비교 조회 중 오류가 발생했습니다.',
        timestamp: new Date()
      };
      
      res.status(500).json(response);
    }
  }
} 