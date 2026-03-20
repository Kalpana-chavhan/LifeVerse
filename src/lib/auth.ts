import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { NextRequest } from 'next/server'

const JWT_SECRET = process.env.JWT_SECRET || process.env.BETTER_AUTH_SECRET || 'lifeverse-dev-secret-change-in-production'

export interface TokenPayload {
  userId: string
  email: string
  username: string
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload
  } catch {
    return null
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

/**
 * Extract session from a Next.js API request.
 * Always pass `req` from API route handlers.
 */
export function getSession(req: NextRequest): TokenPayload | null {
  try {
    const token =
      req.cookies.get('lifeverse_token')?.value ||
      req.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) return null
    return verifyToken(token)
  } catch {
    return null
  }
}
