import Database from "better-sqlite3";
import type { IDatabase } from "../IDatabase.js";
import { SqlLoader } from "@/utils/sql-loader.utils.js";

export class SQLiteDatabase implements IDatabase {
  private db!: Database.Database;

  constructor (private filename: string) { }

  connect(): void {
    this.db = new Database(this.filename);
    this.initializeSchema();
  }

  private initializeSchema(): void {

    try {
      const query = SqlLoader.loadQuery('init_schema');
      this.db.exec(query);
    } catch (error) {
      console.error('Error executing init_shcema:', error);
    }
  }

  disconnect(): void {
    this.db.close();
  }

  query<T = any>(sql: string, params: any[] = []): T[] {
    const stmt = this.db.prepare(sql);
    return stmt.all(...params) as T[];
  }

  execute(sql: string, params: any[] = []): void {
    const stmt = this.db.prepare(sql);
    stmt.run(...params);
  }
}
