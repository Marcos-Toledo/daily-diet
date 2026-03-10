import type { Knex } from "knex"
import { env } from './env'

// Update with your config settings.

const config: Knex.Config = {  
  client: "sqlite3",
  connection: {
    filename: env.DATABASE_URL
  },
  useNullAsDefault: true,
  
  migrations: {
    extension: 'ts',
    directory: './db/migrations'
  }
}

export default config
