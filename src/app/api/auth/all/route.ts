import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const response = await auth.handler(request);
    return response;
  } catch (error) {
    console.error('Auth POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const response = await auth.handler(request);
    return response;
  } catch (error) {
    console.error('Auth GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
