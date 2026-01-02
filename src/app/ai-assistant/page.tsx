"use client";

import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Sparkles, TrendingUp, Calendar, Heart, Building2, Wallet, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AIAssistant() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [selectedAction, setSelectedAction] = useState<string>('');

  const actions = [
    {
      id: 'recommend_tasks',
      title: 'Task Recommendations',
      icon: TrendingUp,
      description: 'Get AI-powered daily task suggestions based on your habits',
      color: 'text-orange-400',
    },
    {
      id: 'predict_habit_failure',
      title: 'Habit Predictions',
      icon: Sparkles,
      description: 'Predict which habits you might struggle with and get prevention tips',
      color: 'text-purple-400',
    },
    {
      id: 'create_study_plan',
      title: 'Study Planner',
      icon: Calendar,
      description: 'Generate personalized study plans with deadlines and time blocks',
      color: 'text-blue-400',
    },
    {
      id: 'mental_health_checkin',
      title: 'Wellness Check-In',
      icon: Heart,
      description: 'Get mental health prompts and wellness suggestions',
      color: 'text-pink-400',
    },
    {
      id: 'suggest_city_expansions',
      title: 'City Planner',
      icon: Building2,
      description: 'AI suggests optimal building upgrades for your FocusCity',
      color: 'text-cyan-400',
    },
    {
      id: 'optimize_budget',
      title: 'Budget Optimizer',
      icon: Wallet,
      description: 'Analyze spending and get personalized financial advice',
      color: 'text-green-400',
    },
  ];

  const handleAction = async (action: string) => {
    setLoading(true);
    setSelectedAction(action);
    setResponse(null);

    try {
      const res = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          context: {
            recentActivity: 'Normal',
            deadlines: 'Final exam in 2 weeks, Project due in 5 days',
            availableTime: '3 hours/day',
            studyStyle: 'Pomodoro',
          },
        }),
      });

      const data = await res.json();
      setResponse(data.response);
    } catch (error) {
      console.error('AI Assistant error:', error);
      setResponse({ error: 'Failed to get AI response' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-20 px-4 game-gradient">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <Brain className="h-16 w-16 mx-auto mb-4 text-rose-400 float-animation" />
            <h1 className="text-5xl font-minecraft mb-4 linear-to-r from-rose-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              AI Life Assistant
            </h1>
            <p className="text-xl text-muted-foreground">
              Your personal AI coach powered by OpenAI GPT-4
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {actions.map((action, index) => (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.03, y: -5 }}
              >
                <Card className="game-card p-6 h-full cursor-pointer hover:shadow-2xl transition-all">
                  <action.icon className={`h-12 w-12 mb-4 ${action.color} float-animation`} />
                  <h3 className="text-xl font-minecraft mb-2">{action.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{action.description}</p>
                  <Button
                    onClick={() => handleAction(action.id)}
                    disabled={loading}
                    className="w-full pixel-button"
                  >
                    {loading && selectedAction === action.id ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Thinking...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Ask AI
                      </>
                    )}
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>

          {response && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-12"
            >
              <Card className="game-card p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Brain className="h-8 w-8 text-rose-400" />
                  <h2 className="text-2xl font-minecraft">AI Response</h2>
                </div>
                <div className="bg-background/50 rounded-lg p-6 backdrop-blur-sm">
                  {response.mockData && (
                    <div className="mb-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                      <p className="text-yellow-400 text-sm">
                        ⚠️ AI Assistant requires OpenAI API key. Add OPENAI_API_KEY to .env to enable.
                      </p>
                    </div>
                  )}
                  <pre className="whitespace-pre-wrap text-sm text-foreground overflow-x-auto">
                    {JSON.stringify(response, null, 2)}
                  </pre>
                </div>
              </Card>
            </motion.div>
          )}

          <Card className="game-card p-8 text-center bg-linear-to-br from-rose-500/10 to-purple-500/10">
            <Sparkles className="h-12 w-12 mx-auto mb-4 text-rose-400" />
            <h3 className="text-2xl font-minecraft mb-3">Setup Instructions</h3>
            <p className="text-muted-foreground mb-4 max-w-2xl mx-auto">
              To enable the AI Life Assistant, add your OpenAI API key to the .env file:
            </p>
            <div className="bg-background/50 rounded-lg p-4 backdrop-blur-sm max-w-xl mx-auto">
              <code className="text-sm text-primary">OPENAI_API_KEY=sk-your-key-here</code>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Get your API key from{' '}
              <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                platform.openai.com/api-keys
              </a>
            </p>
          </Card>
        </div>
      </div>
    </>
  );
}
