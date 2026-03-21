import { drizzle } from 'drizzle-orm/node-postgres'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import pkg from 'pg'
const { Pool } = pkg
import 'dotenv/config'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  const db = drizzle(pool)

  await migrate(db, {
    migrationsFolder: path.join(__dirname, '../../drizzle'),
  })

  console.log('Migration complete')
  await pool.end()
}

main().catch(console.error)
