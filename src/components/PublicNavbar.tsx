"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Gamepad2 } from 'lucide-react';

export function PublicNavbar() {
  return (
    <nav className="border-b border-primary/30 bg-card/80 backdrop-blur-md sticky top-0 z-50 shadow-lg shadow-primary/10">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 transition-transform hover:scale-105">
            <Gamepad2 className="h-8 w-8 text-primary" />
            <span className="text-2xl font-minecraft bg-gradient-to-r from-accent via-secondary to-primary bg-clip-text text-transparent">
              LifeVerse
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link href="/features" className="text-sm font-medium hover:text-primary transition-colors">
              Features
            </Link>
<Link href="/how-it-works" className="text-sm font-medium hover:text-primary transition-colors">
                How It Works
              </Link>
              <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">
                About
              </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                Log In
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="pixel-button">
                <span className="font-minecraft text-xs">Start Free</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}