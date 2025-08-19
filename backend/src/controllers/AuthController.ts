import { Request, Response } from 'express';
import { ApiResponse } from '../types';

export class AuthController {
  // 로그인
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      
      // 실제 인증 로직으로 대체 가능
      if (email === 'admin@example.com' && password === 'password') {
        const user = {
          id: 1,
          email: 'admin@example.com',
          name: '관리자',
          role: 'admin'
        };

        const response: ApiResponse = {
          success: true,
          data: { user, token: 'mock-jwt-token' },
          message: '로그인이 성공했습니다.',
          timestamp: new Date()
        };

        res.status(200).json(response);
      } else {
        const response: ApiResponse = {
          success: false,
          error: '이메일 또는 비밀번호가 올바르지 않습니다.',
          timestamp: new Date()
        };

        res.status(401).json(response);
      }
    } catch (error) {
      console.error('로그인 오류:', error);
      
      const response: ApiResponse = {
        success: false,
        error: '로그인 중 오류가 발생했습니다.',
        timestamp: new Date()
      };
      
      res.status(500).json(response);
    }
  }

  // 회원가입
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, name } = req.body;
      
      // 실제 회원가입 로직으로 대체 가능
      const newUser = {
        id: Date.now(),
        email,
        name,
        role: 'user'
      };

      const response: ApiResponse = {
        success: true,
        data: { user: newUser, token: 'mock-jwt-token' },
        message: '회원가입이 성공했습니다.',
        timestamp: new Date()
      };

      res.status(201).json(response);
    } catch (error) {
      console.error('회원가입 오류:', error);
      
      const response: ApiResponse = {
        success: false,
        error: '회원가입 중 오류가 발생했습니다.',
        timestamp: new Date()
      };
      
      res.status(500).json(response);
    }
  }

  // 로그아웃
  static async logout(req: Request, res: Response): Promise<void> {
    try {
      const response: ApiResponse = {
        success: true,
        message: '로그아웃이 성공했습니다.',
        timestamp: new Date()
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('로그아웃 오류:', error);
      
      const response: ApiResponse = {
        success: false,
        error: '로그아웃 중 오류가 발생했습니다.',
        timestamp: new Date()
      };
      
      res.status(500).json(response);
    }
  }

  // 프로필 조회
  static async getProfile(req: Request, res: Response): Promise<void> {
    try {
      // 실제 사용자 조회 로직으로 대체 가능
      const user = {
        id: 1,
        email: 'admin@example.com',
        name: '관리자',
        role: 'admin'
      };

      const response: ApiResponse = {
        success: true,
        data: user,
        message: '프로필을 성공적으로 조회했습니다.',
        timestamp: new Date()
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('프로필 조회 오류:', error);
      
      const response: ApiResponse = {
        success: false,
        error: '프로필 조회 중 오류가 발생했습니다.',
        timestamp: new Date()
      };
      
      res.status(500).json(response);
    }
  }
} 