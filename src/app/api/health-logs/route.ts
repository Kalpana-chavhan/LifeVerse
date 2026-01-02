import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { HealthLog } from '@/models';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ 
        error: 'userId query parameter is required',
        code: 'MISSING_USER_ID' 
      }, { status: 400 });
    }

    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '30'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (startDate && !dateRegex.test(startDate)) {
      return NextResponse.json({ 
        error: 'Invalid startDate format. Use YYYY-MM-DD',
        code: 'INVALID_DATE_FORMAT'
      }, { status: 400 });
    }
    if (endDate && !dateRegex.test(endDate)) {
      return NextResponse.json({ 
        error: 'Invalid endDate format. Use YYYY-MM-DD',
        code: 'INVALID_DATE_FORMAT'
      }, { status: 400 });
    }

    const filter: any = { userId };

    if (startDate) {
      filter.date = { ...filter.date, $gte: new Date(startDate) };
    }
    
    if (endDate) {
      filter.date = { ...filter.date, $lte: new Date(endDate) };
    }

    const results = await HealthLog.find(filter)
      .sort({ date: -1 })
      .limit(limit)
      .skip(offset);

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { userId, date, waterIntake, steps, sleepHours, mood } = body;

    if (!userId) {
      return NextResponse.json({ 
        error: "userId is required",
        code: "MISSING_USER_ID"
      }, { status: 400 });
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return NextResponse.json({ 
        error: 'Invalid date format. Use YYYY-MM-DD',
        code: 'INVALID_DATE_FORMAT'
      }, { status: 400 });
    }

    if (waterIntake !== undefined && waterIntake < 0) {
      return NextResponse.json({ 
        error: "Water intake must be greater than or equal to 0",
        code: "INVALID_WATER_INTAKE"
      }, { status: 400 });
    }
    if (steps !== undefined && steps < 0) {
      return NextResponse.json({ 
        error: "Steps must be greater than or equal to 0",
        code: "INVALID_STEPS"
      }, { status: 400 });
    }
    if (sleepHours !== undefined && sleepHours < 0) {
      return NextResponse.json({ 
        error: "Sleep hours must be greater than or equal to 0",
        code: "INVALID_SLEEP_HOURS"
      }, { status: 400 });
    }

    const existingLog = await HealthLog.findOne({ userId, date: new Date(date) });

    if (existingLog) {
      const updateData: any = {};

      if (waterIntake !== undefined) updateData.waterIntake = waterIntake;
      if (steps !== undefined) updateData.steps = steps;
      if (sleepHours !== undefined) updateData.sleepHours = sleepHours;
      if (mood !== undefined) updateData.mood = mood;

      const updated = await HealthLog.findOneAndUpdate(
        { userId, date: new Date(date) },
        { $set: updateData },
        { new: true }
      );

      return NextResponse.json(updated, { status: 200 });
    } else {
      const newLog = await HealthLog.create({
        userId,
        date: new Date(date),
        waterIntake: waterIntake ?? 0,
        steps: steps ?? 0,
        sleepHours: sleepHours ?? 0,
        mood: mood ?? undefined,
      });

      return NextResponse.json(newLog, { status: 201 });
    }
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}