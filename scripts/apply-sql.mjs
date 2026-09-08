import { readFileSync } from 'node:fs'
import mysql from 'mysql2/promise'

const files = process.argv.slice(2)

if (files.length === 0) {
  console.error('Usage: node scripts/apply-sql.mjs <file.sql> [more.sql ...]')
  process.exit(1)
}

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not set')
  process.exit(1)
}

const url = new URL(process.env.DATABASE_URL)
const conn = await mysql.createConnection({
  host: url.hostname,
  port: url.port ? Number(url.port) : 3306,
  user: decodeURIComponent(url.username),
  password: decodeURIComponent(url.password),
  database: url.pathname.replace(/^\//, ''),
  multipleStatements: true,
})

try {
  for (const file of files) {
    const text = readFileSync(file, 'utf8')
    if (!text.trim()) continue
    console.log(`Applying ${file} ...`)
    await conn.query(text)
  }
  console.log('All SQL applied successfully.')
} finally {
  await conn.end()
}
