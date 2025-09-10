import 'dotenv/config';

export const envs = {
  port: process.env.PORT ? Number(process.env.PORT) : 3000,
  dreezerApi: process.env.DREEZER_API ? process.env.DREEZER_API : '',
  databaseTypes: process.env.DB_TYPE ? process.env.DB_TYPE : 'sqlite'
}