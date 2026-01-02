"use client";

import { Navbar } from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useGameStore } from '@/lib/store';
import { DollarSign, Plus, TrendingUp, TrendingDown, Target, Zap, Trophy, PiggyBank } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

export default function FinancePage() {
  const { expenses, monthlyBudget, savingsGoal, addExpense, addXP, addCoins } = useGameStore();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newExpense, setNewExpense] = useState({
    amount: '',
    category: 'food',
    description: '',
    type: 'expense' as 'expense' | 'income',
  });

  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthlyExpenses = expenses.filter((e) => e.date.startsWith(currentMonth));
  
  const totalExpenses = monthlyExpenses
    .filter((e) => e.type === 'expense')
    .reduce((sum, e) => sum + e.amount, 0);
  
  const totalIncome = monthlyExpenses
    .filter((e) => e.type === 'income')
    .reduce((sum, e) => sum + e.amount, 0);
  
  const budgetUsed = (totalExpenses / monthlyBudget) * 100;
  const savings = totalIncome - totalExpenses;
  const savingsProgress = (Math.max(0, savings) / savingsGoal) * 100;

  const handleAddExpense = () => {
    const expense = {
      id: `e${Date.now()}`,
      amount: parseFloat(newExpense.amount),
      category: newExpense.category,
      description: newExpense.description,
      type: newExpense.type,
      date: new Date().toISOString(),
    };
    
    addExpense(expense);
    
    // Award XP for tracking finances
    addXP(10);
    
    // Check for budget mission completion
    if (budgetUsed < 80 && totalExpenses > 0) {
      addXP(50);
      addCoins(20);
    }
    
    setIsAddDialogOpen(false);
    setNewExpense({
      amount: '',
      category: 'food',
      description: '',
      type: 'expense',
    });
  };

  // Category breakdown
  const categoryData = monthlyExpenses
    .filter((e) => e.type === 'expense')
    .reduce((acc, e) => {
      const existing = acc.find((item) => item.name === e.category);
      if (existing) {
        existing.value += e.amount;
      } else {
        acc.push({ name: e.category, value: e.amount });
      }
      return acc;
    }, [] as { name: string; value: number }[]);

  const COLORS = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6'];

  // Recent transactions
  const recentTransactions = monthlyExpenses.slice(-10).reverse();

  // Budget missions
  const missions = [
    {
      id: 'm1',
      title: 'Budget Master',
      description: 'Stay under 80% of monthly budget',
      xp: 100,
      coins: 50,
      completed: budgetUsed < 80 && totalExpenses > 0,
    },
    {
      id: 'm2',
      title: 'Savings Hero',
      description: 'Save $500 this month',
      xp: 150,
      coins: 75,
      completed: savings >= 500,
    },
    {
      id: 'm3',
      title: 'Financial Tracker',
      description: 'Log 10 transactions',
      xp: 75,
      coins: 30,
      completed: monthlyExpenses.length >= 10,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                <DollarSign className="h-10 w-10 text-green-500" />
                BudgetQuest
              </h1>
              <p className="text-muted-foreground text-lg">
                Gamify your finances and achieve your money goals
              </p>
            </div>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="gap-2">
                  <Plus className="h-5 w-5" />
                  Add Transaction
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>New Transaction</DialogTitle>
                  <DialogDescription>Track your income or expenses</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label htmlFor="type">Type</Label>
                    <Select
                      value={newExpense.type}
                      onValueChange={(value: any) => setNewExpense({ ...newExpense, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="expense">Expense</SelectItem>
                        <SelectItem value="income">Income</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="amount">Amount ($)</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={newExpense.amount}
                      onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={newExpense.category}
                      onValueChange={(value) => setNewExpense({ ...newExpense, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="food">Food & Dining</SelectItem>
                        <SelectItem value="transport">Transportation</SelectItem>
                        <SelectItem value="entertainment">Entertainment</SelectItem>
                        <SelectItem value="shopping">Shopping</SelectItem>
                        <SelectItem value="bills">Bills & Utilities</SelectItem>
                        <SelectItem value="health">Health</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={newExpense.description}
                      onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                      placeholder="Coffee at Starbucks"
                    />
                  </div>
                </div>
                <Button onClick={handleAddExpense} className="w-full" disabled={!newExpense.amount}>
                  Add Transaction
                </Button>
              </DialogContent>
            </Dialog>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Income</p>
                  <p className="text-2xl font-bold">${totalIncome.toFixed(2)}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-red-500/10 to-orange-500/10 border-red-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Expenses</p>
                  <p className="text-2xl font-bold">${totalExpenses.toFixed(2)}</p>
                </div>
                <TrendingDown className="h-8 w-8 text-red-500" />
              </div>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Savings</p>
                  <p className="text-2xl font-bold">${savings.toFixed(2)}</p>
                </div>
                <PiggyBank className="h-8 w-8 text-blue-500" />
              </div>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Budget Left</p>
                  <p className="text-2xl font-bold">${(monthlyBudget - totalExpenses).toFixed(2)}</p>
                </div>
                <Target className="h-8 w-8 text-purple-500" />
              </div>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Charts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Budget Progress */}
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Monthly Budget</h3>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Used</span>
                  <span className="font-semibold">
                    ${totalExpenses.toFixed(2)} / ${monthlyBudget.toFixed(2)}
                  </span>
                </div>
                <Progress 
                  value={budgetUsed} 
                  className={`h-3 ${budgetUsed > 80 ? '[&>div]:bg-red-500' : budgetUsed > 60 ? '[&>div]:bg-yellow-500' : ''}`}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{budgetUsed.toFixed(1)}% used</span>
                  <span>{(100 - budgetUsed).toFixed(1)}% remaining</span>
                </div>
              </div>
              {budgetUsed > 80 && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-sm text-red-600 dark:text-red-400">
                  ⚠️ Warning: You've used over 80% of your monthly budget!
                </div>
              )}
            </Card>

            {/* Savings Goal */}
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Savings Goal</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-semibold">
                    ${Math.max(0, savings).toFixed(2)} / ${savingsGoal.toFixed(2)}
                  </span>
                </div>
                <Progress value={Math.min(100, savingsProgress)} className="h-3" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{Math.min(100, savingsProgress).toFixed(1)}% achieved</span>
                  <span>${(savingsGoal - Math.max(0, savings)).toFixed(2)} to go</span>
                </div>
              </div>
            </Card>

            {/* Category Breakdown */}
            {categoryData.length > 0 && (
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4">Spending by Category</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: any) => `$${value.toFixed(2)}`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            )}

            {/* Recent Transactions */}
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Recent Transactions</h3>
              <div className="space-y-3">
                {recentTransactions.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No transactions yet. Add one to start tracking!
                  </p>
                ) : (
                  recentTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-full ${
                            transaction.type === 'income'
                              ? 'bg-green-500/10 text-green-500'
                              : 'bg-red-500/10 text-red-500'
                          }`}
                        >
                          {transaction.type === 'income' ? (
                            <TrendingUp className="h-4 w-4" />
                          ) : (
                            <TrendingDown className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold">
                            {transaction.description || 'No description'}
                          </p>
                          <p className="text-sm text-muted-foreground capitalize">
                            {transaction.category} • {new Date(transaction.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`font-bold ${
                          transaction.type === 'income' ? 'text-green-500' : 'text-red-500'
                        }`}
                      >
                        {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>

          {/* Right Column - Missions */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Trophy className="h-6 w-6 text-yellow-500" />
                Budget Missions
              </h3>
              <div className="space-y-4">
                {missions.map((mission) => (
                  <div
                    key={mission.id}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      mission.completed
                        ? 'bg-green-500/10 border-green-500/30'
                        : 'bg-card border-border'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        {mission.completed ? (
                          <Trophy className="h-5 w-5 text-green-500" />
                        ) : (
                          <Target className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">{mission.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{mission.description}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="gap-1">
                            <Zap className="h-3 w-3 text-yellow-500" />
                            {mission.xp} XP
                          </Badge>
                          <Badge variant="outline" className="gap-1">
                            🪙 {mission.coins}
                          </Badge>
                          {mission.completed && (
                            <Badge className="bg-green-500">Completed!</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Tips */}
            <Card className="p-6 bg-gradient-to-br from-primary/10 to-purple-500/10 border-primary/20">
              <h3 className="text-lg font-bold mb-3">💡 Financial Tips</h3>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• Track every transaction to stay aware</li>
                <li>• Set realistic monthly budgets</li>
                <li>• Complete missions for bonus rewards</li>
                <li>• Keep spending under 80% of budget</li>
                <li>• Build your savings goal steadily</li>
              </ul>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
