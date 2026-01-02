"use client";

import { Navbar } from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Plus, BookOpen, Lightbulb, Target, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Note {
  id: string;
  title: string;
  content: string;
  room: string;
  tags: string[];
  createdAt: string;
  lastReviewed?: string;
  strength: number; // 0-100
}

export default function MindPalacePage() {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      title: 'React Hooks Basics',
      content: 'useState, useEffect, useContext are the fundamental hooks for managing state and side effects.',
      room: 'Programming',
      tags: ['react', 'javascript'],
      createdAt: new Date().toISOString(),
      strength: 75,
    },
    {
      id: '2',
      title: 'Spanish Vocabulary',
      content: 'Hola = Hello, Adiós = Goodbye, Gracias = Thank you',
      room: 'Languages',
      tags: ['spanish', 'vocabulary'],
      createdAt: new Date().toISOString(),
      strength: 60,
    },
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    room: 'General',
    tags: '',
  });

  const rooms = ['General', 'Programming', 'Languages', 'Mathematics', 'Science', 'Business', 'Arts', 'Personal'];

  const handleAddNote = () => {
    const note: Note = {
      id: Date.now().toString(),
      title: newNote.title,
      content: newNote.content,
      room: newNote.room,
      tags: newNote.tags.split(',').map(t => t.trim()),
      createdAt: new Date().toISOString(),
      strength: 50,
    };
    setNotes([...notes, note]);
    setIsAddDialogOpen(false);
    setNewNote({ title: '', content: '', room: 'General', tags: '' });
  };

  const handleReview = (id: string) => {
    setNotes(notes.map(note => {
      if (note.id === id) {
        return {
          ...note,
          lastReviewed: new Date().toISOString(),
          strength: Math.min(100, note.strength + 10),
        };
      }
      return note;
    }));
  };

  const groupedNotes = notes.reduce((acc, note) => {
    if (!acc[note.room]) {
      acc[note.room] = [];
    }
    acc[note.room].push(note);
    return acc;
  }, {} as Record<string, Note[]>);

  const getStrengthColor = (strength: number) => {
    if (strength < 30) return 'text-red-500 bg-red-500';
    if (strength < 60) return 'text-yellow-500 bg-yellow-500';
    return 'text-green-500 bg-green-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                <Brain className="h-10 w-10 text-purple-500" />
                Mind Palace
              </h1>
              <p className="text-muted-foreground text-lg">
                Store knowledge, build memory, and strengthen your mental library
              </p>
            </div>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="gap-2">
                  <Plus className="h-5 w-5" />
                  Add Note
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Create New Note</DialogTitle>
                  <DialogDescription>Add knowledge to your Mind Palace</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={newNote.title}
                      onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                      placeholder="React Hooks Tutorial"
                    />
                  </div>
                  <div>
                    <Label htmlFor="room">Room</Label>
                    <Select
                      value={newNote.room}
                      onValueChange={(value) => setNewNote({ ...newNote, room: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {rooms.map(room => (
                          <SelectItem key={room} value={room}>{room}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      value={newNote.content}
                      onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                      placeholder="Write your notes here..."
                      rows={6}
                    />
                  </div>
                  <div>
                    <Label htmlFor="tags">Tags (comma separated)</Label>
                    <Input
                      id="tags"
                      value={newNote.tags}
                      onChange={(e) => setNewNote({ ...newNote, tags: e.target.value })}
                      placeholder="react, javascript, hooks"
                    />
                  </div>
                </div>
                <Button onClick={handleAddNote} className="w-full" disabled={!newNote.title || !newNote.content}>
                  Add to Mind Palace
                </Button>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Notes</p>
                  <p className="text-3xl font-bold">{notes.length}</p>
                </div>
                <BookOpen className="h-8 w-8 text-purple-500" />
              </div>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Rooms</p>
                  <p className="text-3xl font-bold">{Object.keys(groupedNotes).length}</p>
                </div>
                <Brain className="h-8 w-8 text-blue-500" />
              </div>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Mastered</p>
                  <p className="text-3xl font-bold">{notes.filter(n => n.strength >= 80).length}</p>
                </div>
                <Target className="h-8 w-8 text-green-500" />
              </div>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Avg Strength</p>
                  <p className="text-3xl font-bold">
                    {notes.length > 0 ? Math.round(notes.reduce((sum, n) => sum + n.strength, 0) / notes.length) : 0}%
                  </p>
                </div>
                <Lightbulb className="h-8 w-8 text-yellow-500" />
              </div>
            </Card>
          </div>
        </div>

        {/* Rooms */}
        <div className="space-y-8">
          {Object.entries(groupedNotes).map(([room, roomNotes]) => (
            <div key={room}>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white text-lg font-bold">
                  {room[0]}
                </div>
                {room} Room
                <Badge variant="outline" className="ml-2">{roomNotes.length} notes</Badge>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {roomNotes.map((note) => (
                  <Card key={note.id} className="p-5 hover:shadow-lg transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-bold text-lg flex-1">{note.title}</h3>
                      <div className={`w-3 h-3 rounded-full ${getStrengthColor(note.strength)}`} />
                    </div>

                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {note.content}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {note.tags.map((tag, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Memory Strength</span>
                        <span className="font-semibold">{note.strength}%</span>
                      </div>
                      <div className={`h-2 bg-muted rounded-full overflow-hidden`}>
                        <div
                          className={`h-full ${getStrengthColor(note.strength)}`}
                          style={{ width: `${note.strength}%` }}
                        />
                      </div>
                    </div>

                    <Button
                      onClick={() => handleReview(note.id)}
                      size="sm"
                      variant="outline"
                      className="w-full mt-4"
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      Review (+10% strength)
                    </Button>

                    {note.lastReviewed && (
                      <p className="text-xs text-muted-foreground mt-2 text-center">
                        Last reviewed: {new Date(note.lastReviewed).toLocaleDateString()}
                      </p>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {notes.length === 0 && (
          <Card className="p-12 text-center">
            <Brain className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-2xl font-bold mb-2">Your Mind Palace is Empty</h3>
            <p className="text-muted-foreground mb-6">
              Start adding notes to build your knowledge repository
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Note
            </Button>
          </Card>
        )}

        {/* Info Card */}
        <Card className="mt-8 p-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
          <div className="flex items-start gap-4">
            <Sparkles className="h-8 w-8 text-blue-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-bold mb-2">How Mind Palace Works</h3>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• Create notes and organize them into rooms by topic</li>
                <li>• Review notes regularly to increase memory strength</li>
                <li>• Notes at 80%+ strength are considered mastered</li>
                <li>• Use tags to connect related concepts</li>
                <li>• Studying notes boosts your Study Creature evolution</li>
              </ul>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
