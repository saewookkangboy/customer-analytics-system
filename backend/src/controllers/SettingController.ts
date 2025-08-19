import { Request, Response } from 'express';
import { ApiResponse } from '../types';

export interface SystemSettings {
  general: {
    company_name: string;
    timezone: string;
    date_format: string;
    currency: string;
    language: string;
    data_retention_days: number;
    auto_refresh_interval: number;
  };
  dashboard: {
    default_category: 'all' | 'ecommerce' | 'lead_generation' | 'general_website';
    chart_theme: 'light' | 'dark' | 'auto';
    show_real_time_data: boolean;
    max_data_points: number;
    enable_export: boolean;
    enable_sharing: boolean;
  };
  notifications: {
    email_notifications: boolean;
    slack_notifications: boolean;
    alert_thresholds: {
      conversion_rate_min: number;
      revenue_target: number;
      lead_quality_min: number;
      bounce_rate_max: number;
    };
    notification_frequency: 'realtime' | 'hourly' | 'daily' | 'weekly';
  };
  integrations: {
    google_analytics: {
      enabled: boolean;
      tracking_id: string;
      custom_dimensions: string[];
    };
    facebook_pixel: {
      enabled: boolean;
      pixel_id: string;
    };
    google_ads: {
      enabled: boolean;
      conversion_tracking: boolean;
    };
    crm_system: {
      enabled: boolean;
      system_type: 'salesforce' | 'hubspot' | 'pipedrive' | 'custom';
      api_endpoint: string;
      api_key: string;
    };
  };
  security: {
    session_timeout: number;
    max_login_attempts: number;
    require_2fa: boolean;
    ip_whitelist: string[];
    audit_logging: boolean;
  };
  data_processing: {
    real_time_processing: boolean;
    batch_processing_interval: number;
    data_aggregation_rules: {
      hourly: boolean;
      daily: boolean;
      weekly: boolean;
      monthly: boolean;
    };
    data_cleanup_schedule: string;
  };
}

export class SettingController {
  private static settings: SystemSettings = {
    general: {
      company_name: '고객 분석 시스템',
      timezone: 'Asia/Seoul',
      date_format: 'YYYY-MM-DD',
      currency: 'KRW',
      language: 'ko',
      data_retention_days: 365,
      auto_refresh_interval: 30
    },
    dashboard: {
      default_category: 'all',
      chart_theme: 'light',
      show_real_time_data: true,
      max_data_points: 1000,
      enable_export: true,
      enable_sharing: true
    },
    notifications: {
      email_notifications: true,
      slack_notifications: false,
      alert_thresholds: {
        conversion_rate_min: 2.0,
        revenue_target: 1000000,
        lead_quality_min: 7.0,
        bounce_rate_max: 50.0
      },
      notification_frequency: 'daily'
    },
    integrations: {
      google_analytics: {
        enabled: true,
        tracking_id: 'GA-XXXXXXXXX',
        custom_dimensions: ['user_type', 'campaign_source', 'product_category']
      },
      facebook_pixel: {
        enabled: false,
        pixel_id: ''
      },
      google_ads: {
        enabled: false,
        conversion_tracking: false
      },
      crm_system: {
        enabled: false,
        system_type: 'salesforce',
        api_endpoint: '',
        api_key: ''
      }
    },
    security: {
      session_timeout: 3600,
      max_login_attempts: 5,
      require_2fa: false,
      ip_whitelist: [],
      audit_logging: true
    },
    data_processing: {
      real_time_processing: true,
      batch_processing_interval: 300,
      data_aggregation_rules: {
        hourly: true,
        daily: true,
        weekly: true,
        monthly: true
      },
      data_cleanup_schedule: '0 2 * * *'
    }
  };

  // 모든 설정 조회
  static async getAllSettings(req: Request, res: Response): Promise<void> {
    try {
      const response: ApiResponse = {
        success: true,
        data: SettingController.settings,
        message: '시스템 설정을 성공적으로 조회했습니다.',
        timestamp: new Date()
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('설정 조회 오류:', error);
      
      const response: ApiResponse = {
        success: false,
        error: '설정 조회 중 오류가 발생했습니다.',
        timestamp: new Date()
      };
      
      res.status(500).json(response);
    }
  }

  // 특정 카테고리 설정 조회
  static async getSettingsByCategory(req: Request, res: Response): Promise<void> {
    try {
      const { category } = req.params;
      
      if (!category || !(category in SettingController.settings)) {
        const response: ApiResponse = {
          success: false,
          error: '유효하지 않은 설정 카테고리입니다.',
          timestamp: new Date()
        };
        
        res.status(400).json(response);
        return;
      }

      const categorySettings = SettingController.settings[category as keyof SystemSettings];

      const response: ApiResponse = {
        success: true,
        data: { [category]: categorySettings },
        message: `${category} 설정을 성공적으로 조회했습니다.`,
        timestamp: new Date()
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('카테고리별 설정 조회 오류:', error);
      
      const response: ApiResponse = {
        success: false,
        error: '카테고리별 설정 조회 중 오류가 발생했습니다.',
        timestamp: new Date()
      };
      
      res.status(500).json(response);
    }
  }

  // 설정 업데이트
  static async updateSettings(req: Request, res: Response): Promise<void> {
    try {
      const { category, settings } = req.body;
      
      if (!category || !(category in SettingController.settings)) {
        const response: ApiResponse = {
          success: false,
          error: '유효하지 않은 설정 카테고리입니다.',
          timestamp: new Date()
        };
        
        res.status(400).json(response);
        return;
      }

      // 설정 유효성 검증
      const validationResult = SettingController.validateSettings(category, settings);
      if (!validationResult.isValid) {
        const response: ApiResponse = {
          success: false,
          error: `설정 유효성 검증 실패: ${validationResult.error}`,
          timestamp: new Date()
        };
        
        res.status(400).json(response);
        return;
      }

      // 설정 업데이트
      SettingController.settings[category as keyof SystemSettings] = {
        ...SettingController.settings[category as keyof SystemSettings],
        ...settings
      };

      const response: ApiResponse = {
        success: true,
        data: { [category]: SettingController.settings[category as keyof SystemSettings] },
        message: `${category} 설정을 성공적으로 업데이트했습니다.`,
        timestamp: new Date()
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('설정 업데이트 오류:', error);
      
      const response: ApiResponse = {
        success: false,
        error: '설정 업데이트 중 오류가 발생했습니다.',
        timestamp: new Date()
      };
      
      res.status(500).json(response);
    }
  }

  // 설정 초기화
  static async resetSettings(req: Request, res: Response): Promise<void> {
    try {
      const { category } = req.params;
      
      if (category && !(category in SettingController.settings)) {
        const response: ApiResponse = {
          success: false,
          error: '유효하지 않은 설정 카테고리입니다.',
          timestamp: new Date()
        };
        
        res.status(400).json(response);
        return;
      }

      if (category) {
        // 특정 카테고리만 초기화
        SettingController.settings[category as keyof SystemSettings] = SettingController.getDefaultSettings(category as keyof SystemSettings);
      } else {
        // 전체 설정 초기화
        SettingController.settings = SettingController.getDefaultSettings();
      }

      const response: ApiResponse = {
        success: true,
        data: category ? { [category]: SettingController.settings[category as keyof SystemSettings] } : SettingController.settings,
        message: category ? `${category} 설정을 초기화했습니다.` : '모든 설정을 초기화했습니다.',
        timestamp: new Date()
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('설정 초기화 오류:', error);
      
      const response: ApiResponse = {
        success: false,
        error: '설정 초기화 중 오류가 발생했습니다.',
        timestamp: new Date()
      };
      
      res.status(500).json(response);
    }
  }

  // 설정 내보내기
  static async exportSettings(req: Request, res: Response): Promise<void> {
    try {
      const { format = 'json' } = req.query;
      
      let exportData;
      let contentType;
      let filename;

      switch (format) {
        case 'json':
          exportData = JSON.stringify(this.settings, null, 2);
          contentType = 'application/json';
          filename = 'system-settings.json';
          break;
        case 'yaml':
          // YAML 변환 로직 (실제로는 yaml 라이브러리 사용)
          exportData = JSON.stringify(this.settings, null, 2);
          contentType = 'text/yaml';
          filename = 'system-settings.yaml';
          break;
        default:
          const response: ApiResponse = {
            success: false,
            error: '지원하지 않는 내보내기 형식입니다.',
            timestamp: new Date()
          };
          
          res.status(400).json(response);
          return;
      }

      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.status(200).send(exportData);
    } catch (error) {
      console.error('설정 내보내기 오류:', error);
      
      const response: ApiResponse = {
        success: false,
        error: '설정 내보내기 중 오류가 발생했습니다.',
        timestamp: new Date()
      };
      
      res.status(500).json(response);
    }
  }

  // 설정 유효성 검증
  private static validateSettings(category: string, settings: any): { isValid: boolean; error?: string } {
    try {
      switch (category) {
        case 'general':
          if (settings.timezone && !this.isValidTimezone(settings.timezone)) {
            return { isValid: false, error: '유효하지 않은 시간대입니다.' };
          }
          if (settings.data_retention_days && (settings.data_retention_days < 1 || settings.data_retention_days > 3650)) {
            return { isValid: false, error: '데이터 보관 기간은 1일에서 3650일 사이여야 합니다.' };
          }
          break;
        case 'dashboard':
          if (settings.default_category && !['all', 'ecommerce', 'lead_generation', 'general_website'].includes(settings.default_category)) {
            return { isValid: false, error: '유효하지 않은 기본 카테고리입니다.' };
          }
          if (settings.max_data_points && (settings.max_data_points < 100 || settings.max_data_points > 10000)) {
            return { isValid: false, error: '최대 데이터 포인트는 100에서 10000 사이여야 합니다.' };
          }
          break;
        case 'notifications':
          if (settings.alert_thresholds) {
            if (settings.alert_thresholds.conversion_rate_min < 0 || settings.alert_thresholds.conversion_rate_min > 100) {
              return { isValid: false, error: '전환율 임계값은 0에서 100 사이여야 합니다.' };
            }
            if (settings.alert_thresholds.bounce_rate_max < 0 || settings.alert_thresholds.bounce_rate_max > 100) {
              return { isValid: false, error: '이탈률 임계값은 0에서 100 사이여야 합니다.' };
            }
          }
          break;
        case 'security':
          if (settings.session_timeout && (settings.session_timeout < 300 || settings.session_timeout > 86400)) {
            return { isValid: false, error: '세션 타임아웃은 300초에서 86400초 사이여야 합니다.' };
          }
          if (settings.max_login_attempts && (settings.max_login_attempts < 1 || settings.max_login_attempts > 10)) {
            return { isValid: false, error: '최대 로그인 시도 횟수는 1에서 10 사이여야 합니다.' };
          }
          break;
      }
      
      return { isValid: true };
    } catch (error) {
      return { isValid: false, error: '설정 유효성 검증 중 오류가 발생했습니다.' };
    }
  }

  // 시간대 유효성 검사
  private static isValidTimezone(timezone: string): boolean {
    try {
      Intl.DateTimeFormat(undefined, { timeZone: timezone });
      return true;
    } catch {
      return false;
    }
  }

  // 기본 설정 반환
  private static getDefaultSettings(category?: keyof SystemSettings): any {
    const defaultSettings: SystemSettings = {
      general: {
        company_name: '고객 분석 시스템',
        timezone: 'Asia/Seoul',
        date_format: 'YYYY-MM-DD',
        currency: 'KRW',
        language: 'ko',
        data_retention_days: 365,
        auto_refresh_interval: 30
      },
      dashboard: {
        default_category: 'all',
        chart_theme: 'light',
        show_real_time_data: true,
        max_data_points: 1000,
        enable_export: true,
        enable_sharing: true
      },
      notifications: {
        email_notifications: true,
        slack_notifications: false,
        alert_thresholds: {
          conversion_rate_min: 2.0,
          revenue_target: 1000000,
          lead_quality_min: 7.0,
          bounce_rate_max: 50.0
        },
        notification_frequency: 'daily'
      },
      integrations: {
        google_analytics: {
          enabled: true,
          tracking_id: 'GA-XXXXXXXXX',
          custom_dimensions: ['user_type', 'campaign_source', 'product_category']
        },
        facebook_pixel: {
          enabled: false,
          pixel_id: ''
        },
        google_ads: {
          enabled: false,
          conversion_tracking: false
        },
        crm_system: {
          enabled: false,
          system_type: 'salesforce',
          api_endpoint: '',
          api_key: ''
        }
      },
      security: {
        session_timeout: 3600,
        max_login_attempts: 5,
        require_2fa: false,
        ip_whitelist: [],
        audit_logging: true
      },
      data_processing: {
        real_time_processing: true,
        batch_processing_interval: 300,
        data_aggregation_rules: {
          hourly: true,
          daily: true,
          weekly: true,
          monthly: true
        },
        data_cleanup_schedule: '0 2 * * *'
      }
    };

    return category ? defaultSettings[category] : defaultSettings;
  }
} 