import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import User from '@/models/User';
import Quest from '@/models/Quest';
import Creature from '@/models/Creature';
import { connectDB } from '@/lib/db';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { action, context } = await request.json();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const quests = await Quest.find({ userId: user._id }).sort({ createdAt: -1 }).limit(20);
    const creatures = await Creature.find({ userId: user._id });

    let systemPrompt = '';
    let userPrompt = '';

    switch (action) {
      case 'recommend_tasks':
        systemPrompt = `You are a life coach AI assistant for LifeVerse, a gamified productivity app. Analyze user data and recommend 3-5 actionable daily tasks based on their habits, incomplete quests, and goals. Be motivating and specific.`;
        userPrompt = `User Stats:
- Level: ${user.level}
- XP: ${user.xp}
- Coins: ${user.coins}
- Profession: ${user.profession || 'None'}
- Recent Quests: ${quests.slice(0, 5).map((q: any) => `${q.title} (${q.completed ? 'Done' : 'Incomplete'})`).join(', ')}
- Creatures: ${creatures.map((c: any) => `${c.name} (${c.species}, ${c.evolutionStage})`).join(', ')}

Recommend 3-5 daily tasks that will help them level up and improve their life. Format as a JSON array with: [{title, description, estimatedXP, category}]`;
        break;

      case 'predict_habit_failure':
        systemPrompt = `You are a predictive analytics AI for LifeVerse. Analyze user habits and predict which tasks/habits they might fail at, along with preventive strategies.`;
        userPrompt = `User Stats:
- Level: ${user.level}
- Active Quests: ${quests.filter((q: any) => !q.completed).length}
- Streak Data: ${quests.filter((q: any) => q.streak > 0).map((q: any) => `${q.title}: ${q.streak} days`).join(', ')}
- Recent Activity: ${context?.recentActivity || 'Normal'}

Predict 2-3 habits/tasks they might struggle with today and provide preventive tips. Format as JSON: [{habit, riskLevel, preventiveTips: []}]`;
        break;

      case 'create_study_plan':
        systemPrompt = `You are an academic planning AI for LifeVerse. Create optimized study plans based on deadlines, current workload, and user preferences.`;
        userPrompt = `User Stats:
- Level: ${user.level}
- Study Sessions Completed: ${context?.studySessionsCompleted || 0}
- Upcoming Deadlines: ${context?.deadlines || 'None provided'}
- Available Study Time: ${context?.availableTime || '2-3 hours/day'}
- Preferred Study Style: ${context?.studyStyle || 'Pomodoro'}

Create a weekly study plan with daily sessions, topics, and time blocks. Format as JSON: {weekPlan: [{day, sessions: [{time, topic, duration, focusLevel}]}], tips: []}`;
        break;

      case 'mental_health_checkin':
        systemPrompt = `You are a compassionate mental health AI for LifeVerse. Provide supportive check-in prompts and wellness suggestions.`;
        userPrompt = `User Stats:
- Level: ${user.level}
- Recent Mood: ${context?.recentMood || 'Not tracked'}
- Streak Health: ${quests.filter((q: any) => q.streak > 7).length} active streaks
- Last Active: ${context?.lastActive || 'Today'}

Provide 3 mental health check-in questions and 3 wellness suggestions. Format as JSON: {checkInQuestions: [], wellnessSuggestions: [], motivationalMessage: ""}`;
        break;

      case 'suggest_city_expansions':
        systemPrompt = `You are a city planning AI for LifeVerse. Suggest building upgrades and expansions based on user progress.`;
        userPrompt = `User Stats:
- Level: ${user.level}
- Coins: ${user.coins}
- Current Buildings: ${context?.buildings || 'Basic structures'}
- Focus Areas: ${context?.focusAreas || 'Balanced'}

Suggest 3-5 building upgrades or new structures that match their gameplay style. Format as JSON: [{buildingName, cost, benefit, priority}]`;
        break;

      case 'optimize_budget':
        systemPrompt = `You are a financial optimization AI for LifeVerse. Analyze spending patterns and suggest budget improvements.`;
        userPrompt = `User Stats:
- Monthly Expenses: ${context?.expenses || 'Not provided'}
- Savings Goals: ${context?.savingsGoals || 'None set'}
- Income: ${context?.income || 'Not specified'}

Analyze and provide 3-5 budget optimization tips. Format as JSON: {optimizationTips: [{category, suggestion, potentialSavings}], budgetAllocation: {}}`;
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        response: {
          message: 'AI Assistant is currently unavailable. Please add your OPENAI_API_KEY to enable this feature.',
          mockData: true,
        },
      });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const aiResponse = completion.choices[0].message.content;

    try {
      const parsedResponse = JSON.parse(aiResponse || '{}');
      return NextResponse.json({ response: parsedResponse });
    } catch {
      return NextResponse.json({ response: { message: aiResponse } });
    }
  } catch (error: any) {
    console.error('AI Assistant error:', error);
    return NextResponse.json(
      { error: 'Failed to generate AI response', details: error.message },
      { status: 500 }
    );
  }
}
