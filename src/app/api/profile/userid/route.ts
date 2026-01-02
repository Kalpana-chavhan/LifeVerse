import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    const params = await context.params;
    const { userId } = params;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required', code: 'MISSING_USER_ID' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("lifeverse");

    const profile = await db.collection('userProfiles').findOne({ userId });

    if (!profile) {
      return NextResponse.json(
        { error: 'User profile not found', code: 'PROFILE_NOT_FOUND' },
        { status: 404 }
      );
    }

    const user = await db.collection('user').findOne({ _id: userId });

    return NextResponse.json({
      ...profile,
      userName: user?.name,
      userEmail: user?.email,
      userImage: user?.image,
    }, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}
