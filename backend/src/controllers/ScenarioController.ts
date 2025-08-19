import { Request, Response } from 'express';
import { ScenarioModel } from '../models/ScenarioModel';
import { ApiResponse } from '../types';

export class ScenarioController {
  // 시나리오 생성
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const scenario = await ScenarioModel.create(req.body);
      
      const response: ApiResponse = {
        success: true,
        data: scenario,
        message: '시나리오가 성공적으로 생성되었습니다.',
        timestamp: new Date()
      };
      
      res.status(201).json(response);
    } catch (error) {
      console.error('시나리오 생성 오류:', error);
      
      const response: ApiResponse = {
        success: false,
        error: '시나리오 생성 중 오류가 발생했습니다.',
        timestamp: new Date()
      };
      
      res.status(500).json(response);
    }
  }

  // 모든 시나리오 조회
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const { active_only = 'true' } = req.query;
      const activeOnly = active_only === 'true';
      
      const scenarios = await ScenarioModel.findAll(activeOnly);
      
      const response: ApiResponse = {
        success: true,
        data: scenarios,
        message: '시나리오 목록을 성공적으로 조회했습니다.',
        timestamp: new Date()
      };
      
      res.status(200).json(response);
    } catch (error) {
      console.error('시나리오 조회 오류:', error);
      
      const response: ApiResponse = {
        success: false,
        error: '시나리오 조회 중 오류가 발생했습니다.',
        timestamp: new Date()
      };
      
      res.status(500).json(response);
    }
  }

  // ID로 시나리오 조회
  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        const response: ApiResponse = {
          success: false,
          error: '시나리오 ID가 필요합니다.',
          timestamp: new Date()
        };
        res.status(400).json(response);
        return;
      }
      const scenarioId = parseInt(id);
      
      if (isNaN(scenarioId)) {
        const response: ApiResponse = {
          success: false,
          error: '유효하지 않은 시나리오 ID입니다.',
          timestamp: new Date()
        };
        res.status(400).json(response);
        return;
      }
      
      const scenario = await ScenarioModel.findById(scenarioId);
      
      if (!scenario) {
        const response: ApiResponse = {
          success: false,
          error: '시나리오를 찾을 수 없습니다.',
          timestamp: new Date()
        };
        res.status(404).json(response);
        return;
      }
      
      const response: ApiResponse = {
        success: true,
        data: scenario,
        message: '시나리오를 성공적으로 조회했습니다.',
        timestamp: new Date()
      };
      
      res.status(200).json(response);
    } catch (error) {
      console.error('시나리오 조회 오류:', error);
      
      const response: ApiResponse = {
        success: false,
        error: '시나리오 조회 중 오류가 발생했습니다.',
        timestamp: new Date()
      };
      
      res.status(500).json(response);
    }
  }

  // 시나리오와 단계 정보 함께 조회
  static async getWithStages(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        const response: ApiResponse = {
          success: false,
          error: '시나리오 ID가 필요합니다.',
          timestamp: new Date()
        };
        res.status(400).json(response);
        return;
      }
      const scenarioId = parseInt(id);
      
      if (isNaN(scenarioId)) {
        const response: ApiResponse = {
          success: false,
          error: '유효하지 않은 시나리오 ID입니다.',
          timestamp: new Date()
        };
        res.status(400).json(response);
        return;
      }
      
      const result = await ScenarioModel.findWithStages(scenarioId);
      
      if (!result) {
        const response: ApiResponse = {
          success: false,
          error: '시나리오를 찾을 수 없습니다.',
          timestamp: new Date()
        };
        res.status(404).json(response);
        return;
      }
      
      const response: ApiResponse = {
        success: true,
        data: result,
        message: '시나리오와 단계 정보를 성공적으로 조회했습니다.',
        timestamp: new Date()
      };
      
      res.status(200).json(response);
    } catch (error) {
      console.error('시나리오 조회 오류:', error);
      
      const response: ApiResponse = {
        success: false,
        error: '시나리오 조회 중 오류가 발생했습니다.',
        timestamp: new Date()
      };
      
      res.status(500).json(response);
    }
  }

  // 시나리오 업데이트
  static async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        const response: ApiResponse = {
          success: false,
          error: '시나리오 ID가 필요합니다.',
          timestamp: new Date()
        };
        res.status(400).json(response);
        return;
      }
      const scenarioId = parseInt(id);
      
      if (isNaN(scenarioId)) {
        const response: ApiResponse = {
          success: false,
          error: '유효하지 않은 시나리오 ID입니다.',
          timestamp: new Date()
        };
        res.status(400).json(response);
        return;
      }
      
      const updatedScenario = await ScenarioModel.update(scenarioId, req.body);
      
      if (!updatedScenario) {
        const response: ApiResponse = {
          success: false,
          error: '시나리오를 찾을 수 없습니다.',
          timestamp: new Date()
        };
        res.status(404).json(response);
        return;
      }
      
      const response: ApiResponse = {
        success: true,
        data: updatedScenario,
        message: '시나리오가 성공적으로 업데이트되었습니다.',
        timestamp: new Date()
      };
      
      res.status(200).json(response);
    } catch (error) {
      console.error('시나리오 업데이트 오류:', error);
      
      const response: ApiResponse = {
        success: false,
        error: '시나리오 업데이트 중 오류가 발생했습니다.',
        timestamp: new Date()
      };
      
      res.status(500).json(response);
    }
  }

  // 시나리오 삭제
  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        const response: ApiResponse = {
          success: false,
          error: '시나리오 ID가 필요합니다.',
          timestamp: new Date()
        };
        res.status(400).json(response);
        return;
      }
      const scenarioId = parseInt(id);
      
      if (isNaN(scenarioId)) {
        const response: ApiResponse = {
          success: false,
          error: '유효하지 않은 시나리오 ID입니다.',
          timestamp: new Date()
        };
        res.status(400).json(response);
        return;
      }
      
      const deleted = await ScenarioModel.delete(scenarioId);
      
      if (!deleted) {
        const response: ApiResponse = {
          success: false,
          error: '시나리오를 찾을 수 없습니다.',
          timestamp: new Date()
        };
        res.status(404).json(response);
        return;
      }
      
      const response: ApiResponse = {
        success: true,
        message: '시나리오가 성공적으로 삭제되었습니다.',
        timestamp: new Date()
      };
      
      res.status(200).json(response);
    } catch (error) {
      console.error('시나리오 삭제 오류:', error);
      
      const response: ApiResponse = {
        success: false,
        error: '시나리오 삭제 중 오류가 발생했습니다.',
        timestamp: new Date()
      };
      
      res.status(500).json(response);
    }
  }

  // 시나리오 성과 통계 조회
  static async getPerformanceStats(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        const response: ApiResponse = {
          success: false,
          error: '시나리오 ID가 필요합니다.',
          timestamp: new Date()
        };
        res.status(400).json(response);
        return;
      }
      const scenarioId = parseInt(id);
      const { start_date, end_date } = req.query;
      
      if (isNaN(scenarioId)) {
        const response: ApiResponse = {
          success: false,
          error: '유효하지 않은 시나리오 ID입니다.',
          timestamp: new Date()
        };
        res.status(400).json(response);
        return;
      }
      
      const startDate = start_date ? new Date(start_date as string) : undefined;
      const endDate = end_date ? new Date(end_date as string) : undefined;
      
      const stats = await ScenarioModel.getPerformanceStats(scenarioId, startDate, endDate);
      
      const response: ApiResponse = {
        success: true,
        data: stats,
        message: '시나리오 성과 통계를 성공적으로 조회했습니다.',
        timestamp: new Date()
      };
      
      res.status(200).json(response);
    } catch (error) {
      console.error('성과 통계 조회 오류:', error);
      
      const response: ApiResponse = {
        success: false,
        error: '성과 통계 조회 중 오류가 발생했습니다.',
        timestamp: new Date()
      };
      
      res.status(500).json(response);
    }
  }

  // 시나리오 퍼널 데이터 조회
  static async getFunnelData(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        const response: ApiResponse = {
          success: false,
          error: '시나리오 ID가 필요합니다.',
          timestamp: new Date()
        };
        res.status(400).json(response);
        return;
      }
      const scenarioId = parseInt(id);
      const { start_date, end_date } = req.query;
      
      if (isNaN(scenarioId)) {
        const response: ApiResponse = {
          success: false,
          error: '유효하지 않은 시나리오 ID입니다.',
          timestamp: new Date()
        };
        res.status(400).json(response);
        return;
      }
      
      const startDate = start_date ? new Date(start_date as string) : undefined;
      const endDate = end_date ? new Date(end_date as string) : undefined;
      
      const funnelData = await ScenarioModel.getFunnelData(scenarioId, startDate, endDate);
      
      const response: ApiResponse = {
        success: true,
        data: funnelData,
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

  // 시나리오 드롭아웃 분석 조회
  static async getDropoutAnalysis(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        const response: ApiResponse = {
          success: false,
          error: '시나리오 ID가 필요합니다.',
          timestamp: new Date()
        };
        res.status(400).json(response);
        return;
      }
      const scenarioId = parseInt(id);
      const { start_date, end_date } = req.query;
      
      if (isNaN(scenarioId)) {
        const response: ApiResponse = {
          success: false,
          error: '유효하지 않은 시나리오 ID입니다.',
          timestamp: new Date()
        };
        res.status(400).json(response);
        return;
      }
      
      const startDate = start_date ? new Date(start_date as string) : undefined;
      const endDate = end_date ? new Date(end_date as string) : undefined;
      
      const dropoutData = await ScenarioModel.getDropoutAnalysis(scenarioId, startDate, endDate);
      
      const response: ApiResponse = {
        success: true,
        data: dropoutData,
        message: '드롭아웃 분석 데이터를 성공적으로 조회했습니다.',
        timestamp: new Date()
      };
      
      res.status(200).json(response);
    } catch (error) {
      console.error('드롭아웃 분석 조회 오류:', error);
      
      const response: ApiResponse = {
        success: false,
        error: '드롭아웃 분석 조회 중 오류가 발생했습니다.',
        timestamp: new Date()
      };
      
      res.status(500).json(response);
    }
  }
} 