"use client";

import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Calendar, CheckSquare, TrendingUp, Plus, Trash2, Zap, Trophy } from 'lucide-react';
import { toast } from 'sonner';

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
}

interface TodoItem {
  id: string;
  title: string;
  description?: string;
}

export default function QuestGeneratorPage() {
  const [calendar, setCalendar] = useState<CalendarEvent[]>([]);
  const [todoList, setTodoList] = useState<TodoItem[]>([]);
  const [newEvent, setNewEvent] = useState({ title: '', date: '' });
  const [newTodo, setNewTodo] = useState({ title: '', description: '' });
  const [generating, setGenerating] = useState(false);
  const [generatedCount, setGeneratedCount] = useState(0);
  const [performanceScore, setPerformanceScore] = useState(0);

  const addCalendarEvent = () => {
    if (!newEvent.title || !newEvent.date) {
      toast.error('Please fill in all calendar fields');
      return;
    }
    setCalendar([...calendar, { ...newEvent, id: Date.now().toString() }]);
    setNewEvent({ title: '', date: '' });
    toast.success('Calendar event added!');
  };

  const removeCalendarEvent = (id: string) => {
    setCalendar(calendar.filter(e => e.id !== id));
  };

  const addTodoItem = () => {
    if (!newTodo.title) {
      toast.error('Please enter a todo title');
      return;
    }
    setTodoList([...todoList, { ...newTodo, id: Date.now().toString() }]);
    setNewTodo({ title: '', description: '' });
    toast.success('Todo item added!');
  };

  const removeTodoItem = (id: string) => {
    setTodoList(todoList.filter(t => t.id !== id));
  };

  const generateQuests = async () => {
    setGenerating(true);
    try {
      const response = await fetch('/api/quest-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          calendar,
          todoList,
          pastPerformance: true
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setGeneratedCount(data.generated);
        setPerformanceScore(data.performanceScore);
        toast.success(`${data.message}`);
      } else {
        toast.error(data.error || 'Failed to generate quests');
      }
    } catch (error) {
      toast.error('Error generating quests');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Sparkles className="h-10 w-10 text-purple-500" />
            AI Quest Generator
          </h1>
          <p className="text-muted-foreground text-lg">
            Automatically generate personalized quests based on your calendar, todos, and performance
          </p>
        </div>

        {generatedCount > 0 && (
          <Card className="p-6 mb-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
            <div className="flex items-center gap-4">
              <Trophy className="h-12 w-12 text-yellow-500" />
              <div>
                <h3 className="text-xl font-bold mb-1">Quests Generated Successfully!</h3>
                <p className="text-muted-foreground">
                  Created {generatedCount} personalized quests • Performance Score: {performanceScore}/5
                </p>
              </div>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Calendar className="h-6 w-6 text-blue-500" />
              Your Calendar
            </h2>
            
            <div className="space-y-3 mb-4">
              <Input
                placeholder="Event title"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              />
              <Input
                type="date"
                value={newEvent.date}
                onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
              />
              <Button onClick={addCalendarEvent} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Calendar Event
              </Button>
            </div>

            <div className="space-y-2">
              {calendar.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No calendar events yet. Add some above!
                </p>
              ) : (
                calendar.map((event) => (
                  <Card key={event.id} className="p-3 flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{event.title}</h4>
                      <p className="text-xs text-muted-foreground">{event.date}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCalendarEvent(event.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </Card>
                ))
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <CheckSquare className="h-6 w-6 text-green-500" />
              Your To-Do List
            </h2>
            
            <div className="space-y-3 mb-4">
              <Input
                placeholder="Todo title"
                value={newTodo.title}
                onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
              />
              <Input
                placeholder="Description (optional)"
                value={newTodo.description}
                onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
              />
              <Button onClick={addTodoItem} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Todo Item
              </Button>
            </div>

            <div className="space-y-2">
              {todoList.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No todo items yet. Add some above!
                </p>
              ) : (
                todoList.map((todo) => (
                  <Card key={todo.id} className="p-3 flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{todo.title}</h4>
                      {todo.description && (
                        <p className="text-xs text-muted-foreground">{todo.description}</p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTodoItem(todo.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </Card>
                ))
              )}
            </div>
          </Card>
        </div>

        <Card className="p-6 mb-6 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/20">
          <div className="flex items-start gap-4">
            <TrendingUp className="h-8 w-8 text-orange-500 mt-1" />
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2">Performance Analysis</h3>
              <p className="text-sm text-muted-foreground mb-4">
                The AI analyzes your past quest completions, streaks, and patterns to generate quests 
                matched to your current skill level and habits. The difficulty adjusts based on your 
                recent performance!
              </p>
              <div className="flex gap-2 flex-wrap">
                <Badge variant="outline">Adaptive Difficulty</Badge>
                <Badge variant="outline">Streak Analysis</Badge>
                <Badge variant="outline">Pattern Recognition</Badge>
                <Badge variant="outline">Smart Rewards</Badge>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-8 text-center bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/20">
          <Zap className="h-16 w-16 mx-auto mb-4 text-purple-500" />
          <h2 className="text-3xl font-bold mb-3">Generate Your Quests!</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Click below to let AI create personalized quests based on your calendar events, 
            todo items, and past performance. New quests will appear in your quest page!
          </p>
          <Button
            size="lg"
            onClick={generateQuests}
            disabled={generating}
            className="text-lg px-12 py-6"
          >
            {generating ? (
              <>
                <Sparkles className="h-5 w-5 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5 mr-2" />
                Generate Quests
              </>
            )}
          </Button>
        </Card>
      </main>
    </div>
  );
}
