import { envs } from "@/config/envs.js";
import type { IDatabase } from "../IDatabase.js";
import { SQLiteDatabase } from "./sqlite-database.config.js";

export class DatabaseProvider {
  private static instance: IDatabase;

  static getDatabase(): IDatabase {
    if (!DatabaseProvider.instance) {
      const { databaseTypes } = envs;
      if (databaseTypes === "sqlite") {
        DatabaseProvider.instance = new SQLiteDatabase("database/artist.db");
      } else {
        throw new Error(`Gestor no soportado aún: ${databaseTypes}`);
      }
      DatabaseProvider.instance.connect();
    }
    return DatabaseProvider.instance;
  }
}
