import { Pool, PoolConfig } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig: PoolConfig = {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'customer_analytics',
  password: process.env.DB_PASSWORD || 'password',
  port: parseInt(process.env.DB_PORT || '5432'),
  max: 20, // 최대 연결 수
  idleTimeoutMillis: 30000, // 유휴 연결 타임아웃
  connectionTimeoutMillis: 2000, // 연결 타임아웃
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
};

class Database {
  private static instance: Database;
  private pool: Pool;

  private constructor() {
    this.pool = new Pool(dbConfig);
    
    // 연결 이벤트 리스너
    this.pool.on('connect', (client) => {
      console.log('새로운 데이터베이스 클라이언트가 연결되었습니다.');
    });

    this.pool.on('error', (err, client) => {
      console.error('데이터베이스 클라이언트 오류:', err);
    });

    this.pool.on('remove', (client) => {
      console.log('데이터베이스 클라이언트가 제거되었습니다.');
    });
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public getPool(): Pool {
    return this.pool;
  }

  public async query(text: string, params?: any[]): Promise<any> {
    const start = Date.now();
    try {
      const res = await this.pool.query(text, params);
      const duration = Date.now() - start;
      console.log('실행된 쿼리:', { text, duration, rows: res.rowCount });
      return res;
    } catch (error) {
      console.error('쿼리 실행 오류:', error);
      throw error;
    }
  }

  public async getClient(): Promise<any> {
    return await this.pool.connect();
  }

  public async close(): Promise<void> {
    await this.pool.end();
  }

  // 트랜잭션 실행
  public async transaction<T>(callback: (client: any) => Promise<T>): Promise<T> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // 연결 상태 확인
  public async healthCheck(): Promise<boolean> {
    try {
      const result = await this.query('SELECT 1');
      return result.rows.length > 0;
    } catch (error) {
      console.error('데이터베이스 헬스 체크 실패:', error);
      return false;
    }
  }
}

export default Database.getInstance(); 