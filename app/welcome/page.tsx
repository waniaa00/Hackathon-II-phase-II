'use client'

import Link from 'next/link';
import { Logo } from '@/app/components/layout/Logo';
import { Button } from '@/app/components/ui/Button';

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="container mx-auto px-4 py-6 relative z-10">
        <div className="flex items-center justify-between">
          <Logo size="medium" />
          <div className="flex gap-3">
            <Link href="/login">
              <Button
                variant="outline"
                size="md"
                className="bg-transparent hover:bg-white/10 backdrop-blur-sm border-white/20 text-white transition-all duration-300 hover:scale-105"
              >
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button
                variant="primary"
                size="md"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Organize Your Life,
              <br />
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                One Task at a Time
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
              A modern, intuitive todo app that helps you stay focused and productive.
              Manage tasks with priorities, deadlines, and smart filters.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link href="/todos">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto min-w-[200px] bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  Try Demo
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto min-w-[200px] bg-transparent hover:bg-white/10 backdrop-blur-sm border-white/20 text-white transition-all duration-300 hover:scale-105"
                >
                  Create Account
                </Button>
              </Link>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-20">
              <div className="group bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">✅</div>
                <h3 className="text-xl font-semibold text-white mb-2">Smart Priorities</h3>
                <p className="text-gray-400">
                  Organize tasks by priority levels and focus on what matters most
                </p>
              </div>

              <div className="group bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">📅</div>
                <h3 className="text-xl font-semibold text-white mb-2">Due Dates</h3>
                <p className="text-gray-400">
                  Set deadlines and never miss important tasks with visual indicators
                </p>
              </div>

              <div className="group bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">🔍</div>
                <h3 className="text-xl font-semibold text-white mb-2">Advanced Filters</h3>
                <p className="text-gray-400">
                  Filter by status, priority, tags, and search to find tasks instantly
                </p>
              </div>

              <div className="group bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">🔄</div>
                <h3 className="text-xl font-semibold text-white mb-2">Recurring Tasks</h3>
                <p className="text-gray-400">
                  Set up daily, weekly, or monthly recurring tasks automatically
                </p>
              </div>

              <div className="group bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">🏷️</div>
                <h3 className="text-xl font-semibold text-white mb-2">Custom Tags</h3>
                <p className="text-gray-400">
                  Organize and categorize tasks with custom tags for easy management
                </p>
              </div>

              <div className="group bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">📊</div>
                <h3 className="text-xl font-semibold text-white mb-2">Dashboard</h3>
                <p className="text-gray-400">
                  Track your progress with metrics and today&apos;s focus view
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-gray-400 relative z-10">
        <p className="mb-2">&copy; 2025 Todo App. All rights reserved.</p>
        <p className="text-sm">Developed with ❤️ by <span className="font-semibold text-purple-400">Wania A.</span></p>
      </footer>
    </div>
  );
}
