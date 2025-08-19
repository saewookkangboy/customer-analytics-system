export class DateUtils {
  /**
   * 현재 날짜를 기준으로 과거 N일 전까지의 날짜 배열을 생성
   */
  static getDateRange(days: number): string[] {
    const dates: string[] = [];
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      if (dateString) {
        dates.push(dateString); // YYYY-MM-DD 형식
      }
    }
    
    return dates;
  }

  /**
   * 현재 날짜를 기준으로 과거 N일 전까지의 ISO 날짜시간 배열을 생성
   */
  static getISODateRange(days: number): string[] {
    const dates: string[] = [];
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      // 시간을 랜덤하게 설정 (10:00 ~ 18:00)
      const hours = Math.floor(Math.random() * 8) + 10;
      const minutes = Math.floor(Math.random() * 60);
      date.setHours(hours, minutes, 0, 0);
      dates.push(date.toISOString());
    }
    
    return dates;
  }

  /**
   * 현재 날짜를 기준으로 과거 N일 전까지의 시간별 날짜시간 배열을 생성
   */
  static getHourlyDateRange(days: number): string[] {
    const dates: string[] = [];
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      for (let hour = 0; hour < 24; hour++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        date.setHours(hour, 0, 0, 0);
        dates.push(date.toISOString());
      }
    }
    
    return dates;
  }

  /**
   * 현재 날짜를 기준으로 과거 N일 전까지의 특정 시간대 날짜시간 배열을 생성
   */
  static getTimeRangeDateRange(days: number, startHour: number, endHour: number): string[] {
    const dates: string[] = [];
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      for (let hour = startHour; hour < endHour; hour++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        date.setHours(hour, Math.floor(Math.random() * 60), 0, 0);
        dates.push(date.toISOString());
      }
    }
    
    return dates;
  }

  /**
   * 현재 날짜를 기준으로 과거 N일 전까지의 랜덤 시간대 날짜시간 배열을 생성
   */
  static getRandomTimeDateRange(days: number, count: number): string[] {
    const dates: string[] = [];
    const today = new Date();
    
    for (let i = 0; i < count; i++) {
      const randomDaysAgo = Math.floor(Math.random() * days);
      const date = new Date(today);
      date.setDate(today.getDate() - randomDaysAgo);
      
      // 랜덤 시간 설정 (9:00 ~ 21:00)
      const hours = Math.floor(Math.random() * 12) + 9;
      const minutes = Math.floor(Math.random() * 60);
      const seconds = Math.floor(Math.random() * 60);
      date.setHours(hours, minutes, seconds, 0);
      
      dates.push(date.toISOString());
    }
    
    // 날짜순으로 정렬
    return dates.sort();
  }

  /**
   * 현재 날짜를 기준으로 과거 N일 전까지의 특정 패턴의 날짜시간 배열을 생성
   */
  static getPatternDateRange(days: number, pattern: 'morning' | 'afternoon' | 'evening' | 'night'): string[] {
    const dates: string[] = [];
    const today = new Date();
    
    let startHour: number, endHour: number;
    
    switch (pattern) {
      case 'morning':
        startHour = 6;
        endHour = 12;
        break;
      case 'afternoon':
        startHour = 12;
        endHour = 18;
        break;
      case 'evening':
        startHour = 18;
        endHour = 22;
        break;
      case 'night':
        startHour = 22;
        endHour = 6;
        break;
      default:
        startHour = 9;
        endHour = 18;
    }
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      
      if (pattern === 'night') {
        // 밤 시간대는 전날 22시부터 다음날 6시까지
        if (i === 0) {
          // 오늘은 0시~6시만
          for (let hour = 0; hour < 6; hour++) {
            const nightDate = new Date(date);
            nightDate.setHours(hour, Math.floor(Math.random() * 60), 0, 0);
            dates.push(nightDate.toISOString());
          }
        } else {
          // 다른 날은 22시~6시
          for (let hour = 22; hour < 24; hour++) {
            const nightDate = new Date(date);
            nightDate.setHours(hour, Math.floor(Math.random() * 60), 0, 0);
            dates.push(nightDate.toISOString());
          }
          // 다음날 0시~6시
          const nextDate = new Date(date);
          nextDate.setDate(date.getDate() + 1);
          for (let hour = 0; hour < 6; hour++) {
            const nightDate = new Date(nextDate);
            nightDate.setHours(hour, Math.floor(Math.random() * 60), 0, 0);
            dates.push(nightDate.toISOString());
          }
        }
      } else {
        for (let hour = startHour; hour < endHour; hour++) {
          const patternDate = new Date(date);
          patternDate.setHours(hour, Math.floor(Math.random() * 60), 0, 0);
          dates.push(patternDate.toISOString());
        }
      }
    }
    
    return dates;
  }
} 