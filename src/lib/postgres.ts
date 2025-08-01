import { Pool } from 'pg'

if (!process.env.POSTGRES_URL) {
  throw new Error('Please add your PostgreSQL URL to .env.local')
}

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
})

export default pool