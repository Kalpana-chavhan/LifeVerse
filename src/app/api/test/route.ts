import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'

export async function GET() {
  const checks = {
    mongodb_uri_set: !!process.env.MONGODB_URI,
    mongodb_uri_preview: process.env.MONGODB_URI
      ? process.env.MONGODB_URI.replace(/:([^@]+)@/, ':****@').slice(0, 60) + '...'
      : 'NOT SET',
    auth_secret_set: !!process.env.BETTER_AUTH_SECRET,
    node_env: process.env.NODE_ENV,
    db_connected: false,
    db_error: null as string | null,
  }

  try {
    await connectDB()
    checks.db_connected = true
  } catch (e: unknown) {
    checks.db_error = e instanceof Error ? e.message : String(e)
  }

  const status = checks.db_connected ? 200 : 500
  return NextResponse.json(checks, { status })
}
