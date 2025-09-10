import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

export class SqlLoader {
  private static queriesCache: Map<string, string> = new Map();

  static loadQuery(queryName: string): string {
    if (this.queriesCache.has(queryName)) {
      return this.queriesCache.get(queryName)!;
    }

    try {
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = dirname(__filename);
      const queryPath = join(__dirname, '..', 'sql', 'queries', `${queryName}.sql`);
      const query = readFileSync(queryPath, 'utf-8');
      this.queriesCache.set(queryName, query);
      return query;
    } catch (error) {
      throw new Error(`Failed to load SQL query: ${queryName}. Error: ${error}`);
    }
  }

  static clearCache(): void {
    this.queriesCache.clear();
  }
}