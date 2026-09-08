'use server'

import bcrypt from 'bcryptjs'
import { redirect } from 'next/navigation'
import { sql } from '@/lib/db'
import { createSession, destroySession } from '@/lib/auth'

export type LoginState = { error?: string }

export async function login(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get('email') ?? '')
    .trim()
    .toLowerCase()
  const password = String(formData.get('password') ?? '')

  if (!email || !password) return { error: 'Email and password are required.' }

  const rows = await sql`
    select id, password_hash from staff_users where lower(email) = ${email}
  `
  const user = rows[0] as { id: number; password_hash: string } | undefined

  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return { error: 'Wrong email or password.' }
  }

  await createSession(user.id)
  redirect('/dashboard')
}

export async function logout() {
  await destroySession()
  redirect('/login')
}
