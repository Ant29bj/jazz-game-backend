export interface IDatabase {
  connect(): void;
  disconnect(): void;
  query<T = any>(sql: string, params?: any[]): T[];
  execute(sql: string, params?: any[]): void;
}