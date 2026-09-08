import mysql, { type Pool, type RowDataPacket } from 'mysql2/promise'

let pool: Pool | undefined

function getPool(): Pool {
  if (!pool) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is not set')
    }
    pool = mysql.createPool(process.env.DATABASE_URL)
  }
  return pool
}

export async function sql(
  strings: TemplateStringsArray,
  ...values: unknown[]
): Promise<Record<string, unknown>[]> {
  const text = strings.reduce((query, part, i) => query + part + (i < values.length ? '?' : ''), '')
  const [rows] = await getPool().query<RowDataPacket[]>(text, values)
  return rows as Record<string, unknown>[]
}
