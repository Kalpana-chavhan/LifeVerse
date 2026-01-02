import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Expense } from '@/models';

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

    const category = searchParams.get('category');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');

    const filter: any = { userId };

    if (category) {
      filter.category = category;
    }

    if (startDate) {
      filter.expenseDate = { ...filter.expenseDate, $gte: new Date(startDate) };
    }

    if (endDate) {
      filter.expenseDate = { ...filter.expenseDate, $lte: new Date(endDate) };
    }

    const results = await Expense.find(filter)
      .sort({ expenseDate: -1 })
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
    const { userId, amount, category, description, expenseDate, xpEarned } = body;

    if (!userId) {
      return NextResponse.json({ 
        error: "userId is required",
        code: "MISSING_USER_ID" 
      }, { status: 400 });
    }

    if (!amount) {
      return NextResponse.json({ 
        error: "Amount is required",
        code: "MISSING_AMOUNT" 
      }, { status: 400 });
    }

    if (!category) {
      return NextResponse.json({ 
        error: "Category is required",
        code: "MISSING_CATEGORY" 
      }, { status: 400 });
    }

    if (!expenseDate) {
      return NextResponse.json({ 
        error: "Expense date is required",
        code: "MISSING_EXPENSE_DATE" 
      }, { status: 400 });
    }

    if (xpEarned === undefined || xpEarned === null) {
      return NextResponse.json({ 
        error: "XP earned is required",
        code: "MISSING_XP_EARNED" 
      }, { status: 400 });
    }

    if (amount <= 0) {
      return NextResponse.json({ 
        error: "Amount must be greater than 0",
        code: "INVALID_AMOUNT" 
      }, { status: 400 });
    }

    if (xpEarned < 0) {
      return NextResponse.json({ 
        error: "XP earned must be greater than or equal to 0",
        code: "INVALID_XP_EARNED" 
      }, { status: 400 });
    }

    const newExpense = await Expense.create({
      userId,
      amount: parseInt(amount.toString()),
      category: category.trim(),
      description: description ? description.trim() : undefined,
      expenseDate,
      xpEarned: parseInt(xpEarned.toString()),
    });

    return NextResponse.json(newExpense, { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}