import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("lifeverse");
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const userId = searchParams.get('userId');

    if (!userId && !id) {
      return NextResponse.json({ 
        error: 'userId query parameter is required',
        code: 'MISSING_USER_ID' 
      }, { status: 400 });
    }

    if (id) {
      let objectId: ObjectId;
      try {
        objectId = new ObjectId(id);
      } catch {
        return NextResponse.json({ 
          error: 'Valid ID is required',
          code: 'INVALID_ID' 
        }, { status: 400 });
      }

      const query: Record<string, unknown> = { _id: objectId };
      if (userId) query.userId = userId;

      const goal = await db.collection('savingsGoals').findOne(query);

      if (!goal) {
        return NextResponse.json({ error: 'Savings goal not found' }, { status: 404 });
      }

      return NextResponse.json(goal, { status: 200 });
    }

    const limit = Math.min(parseInt(searchParams.get('limit') ?? '20'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const status = searchParams.get('status');

    const query: Record<string, unknown> = { userId };

    if (status) {
      const validStatuses = ['active', 'completed', 'failed'];
      if (!validStatuses.includes(status)) {
        return NextResponse.json({ 
          error: 'Invalid status. Must be one of: active, completed, failed',
          code: 'INVALID_STATUS' 
        }, { status: 400 });
      }
      query.status = status;
    }

    const results = await db.collection('savingsGoals')
      .find(query)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .toArray();

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
    const client = await clientPromise;
    const db = client.db("lifeverse");
    
    const body = await request.json();
    const { userId, title, targetAmount, deadline, currentAmount, status } = body;

    if (!userId) {
      return NextResponse.json({ 
        error: 'userId is required',
        code: 'MISSING_USER_ID' 
      }, { status: 400 });
    }

    if (!title) {
      return NextResponse.json({ 
        error: 'Title is required',
        code: 'MISSING_TITLE' 
      }, { status: 400 });
    }

    if (!targetAmount && targetAmount !== 0) {
      return NextResponse.json({ 
        error: 'Target amount is required',
        code: 'MISSING_TARGET_AMOUNT' 
      }, { status: 400 });
    }

    if (!deadline) {
      return NextResponse.json({ 
        error: 'Deadline is required',
        code: 'MISSING_DEADLINE' 
      }, { status: 400 });
    }

    if (typeof targetAmount !== 'number' || targetAmount <= 0) {
      return NextResponse.json({ 
        error: 'Target amount must be greater than 0',
        code: 'INVALID_TARGET_AMOUNT' 
      }, { status: 400 });
    }

    const validatedCurrentAmount = currentAmount ?? 0;
    if (typeof validatedCurrentAmount !== 'number' || validatedCurrentAmount < 0) {
      return NextResponse.json({ 
        error: 'Current amount must be greater than or equal to 0',
        code: 'INVALID_CURRENT_AMOUNT' 
      }, { status: 400 });
    }

    const validatedStatus = status ?? 'active';
    const validStatuses = ['active', 'completed', 'failed'];
    if (!validStatuses.includes(validatedStatus)) {
      return NextResponse.json({ 
        error: 'Status must be one of: active, completed, failed',
        code: 'INVALID_STATUS' 
      }, { status: 400 });
    }

    try {
      new Date(deadline).toISOString();
    } catch {
      return NextResponse.json({ 
        error: 'Invalid deadline format. Must be a valid ISO timestamp',
        code: 'INVALID_DEADLINE' 
      }, { status: 400 });
    }

    const now = new Date();

    const newGoal = {
      userId,
      title: title.trim(),
      targetAmount,
      currentAmount: validatedCurrentAmount,
      deadline,
      status: validatedStatus,
      createdAt: now,
      updatedAt: now,
    };

    const result = await db.collection('savingsGoals').insertOne(newGoal);

    return NextResponse.json({ ...newGoal, _id: result.insertedId }, { status: 201 });

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("lifeverse");
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const userId = searchParams.get('userId');

    if (!id) {
      return NextResponse.json({ 
        error: 'Valid ID is required',
        code: 'INVALID_ID' 
      }, { status: 400 });
    }

    let objectId: ObjectId;
    try {
      objectId = new ObjectId(id);
    } catch {
      return NextResponse.json({ 
        error: 'Valid ID is required',
        code: 'INVALID_ID' 
      }, { status: 400 });
    }

    const body = await request.json();

    if ('userId' in body || 'user_id' in body) {
      return NextResponse.json({ 
        error: 'User ID cannot be provided in request body',
        code: 'USER_ID_NOT_ALLOWED' 
      }, { status: 400 });
    }

    const query: Record<string, unknown> = { _id: objectId };
    if (userId) query.userId = userId;

    const existingGoal = await db.collection('savingsGoals').findOne(query);

    if (!existingGoal) {
      return NextResponse.json({ error: 'Savings goal not found' }, { status: 404 });
    }

    const { title, targetAmount, currentAmount, deadline, status } = body;

    if (targetAmount !== undefined && (typeof targetAmount !== 'number' || targetAmount <= 0)) {
      return NextResponse.json({ 
        error: 'Target amount must be greater than 0',
        code: 'INVALID_TARGET_AMOUNT' 
      }, { status: 400 });
    }

    if (currentAmount !== undefined && (typeof currentAmount !== 'number' || currentAmount < 0)) {
      return NextResponse.json({ 
        error: 'Current amount must be greater than or equal to 0',
        code: 'INVALID_CURRENT_AMOUNT' 
      }, { status: 400 });
    }

    if (status !== undefined) {
      const validStatuses = ['active', 'completed', 'failed'];
      if (!validStatuses.includes(status)) {
        return NextResponse.json({ 
          error: 'Status must be one of: active, completed, failed',
          code: 'INVALID_STATUS' 
        }, { status: 400 });
      }
    }

    if (deadline !== undefined) {
      try {
        new Date(deadline).toISOString();
      } catch {
        return NextResponse.json({ 
          error: 'Invalid deadline format. Must be a valid ISO timestamp',
          code: 'INVALID_DEADLINE' 
        }, { status: 400 });
      }
    }

    const updates: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    if (title !== undefined) updates.title = title.trim();
    if (targetAmount !== undefined) updates.targetAmount = targetAmount;
    if (currentAmount !== undefined) updates.currentAmount = currentAmount;
    if (deadline !== undefined) updates.deadline = deadline;
    if (status !== undefined) updates.status = status;

    const finalCurrentAmount = currentAmount !== undefined ? currentAmount : existingGoal.currentAmount;
    const finalTargetAmount = targetAmount !== undefined ? targetAmount : existingGoal.targetAmount;

    if (finalCurrentAmount >= finalTargetAmount && status !== 'failed') {
      updates.status = 'completed';
    }

    const updated = await db.collection('savingsGoals').findOneAndUpdate(
      query,
      { $set: updates },
      { returnDocument: 'after' }
    );

    return NextResponse.json(updated, { status: 200 });

  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("lifeverse");
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const userId = searchParams.get('userId');

    if (!id) {
      return NextResponse.json({ 
        error: 'Valid ID is required',
        code: 'INVALID_ID' 
      }, { status: 400 });
    }

    let objectId: ObjectId;
    try {
      objectId = new ObjectId(id);
    } catch {
      return NextResponse.json({ 
        error: 'Valid ID is required',
        code: 'INVALID_ID' 
      }, { status: 400 });
    }

    const query: Record<string, unknown> = { _id: objectId };
    if (userId) query.userId = userId;

    const existingGoal = await db.collection('savingsGoals').findOne(query);

    if (!existingGoal) {
      return NextResponse.json({ error: 'Savings goal not found' }, { status: 404 });
    }

    await db.collection('savingsGoals').deleteOne(query);

    return NextResponse.json({ 
      message: 'Savings goal deleted successfully',
      goal: existingGoal 
    }, { status: 200 });

  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}
