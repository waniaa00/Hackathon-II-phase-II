'use client'

import Link from 'next/link';
import { Logo } from '@/app/components/layout/Logo';
import { Button } from '@/app/components/ui/Button';

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Logo size="medium" />
          <div className="flex gap-3">
            <Link href="/login">
              <Button variant="secondary" size="md">
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button variant="primary" size="md">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-800 mb-6">
              Organize Your Life,
              <br />
              <span className="text-blue-600">One Task at a Time</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto">
              A modern, intuitive todo app that helps you stay focused and productive.
              Manage tasks with priorities, deadlines, and smart filters.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link href="/todos">
                <Button variant="primary" size="lg" className="w-full sm:w-auto min-w-[200px]">
                  Try Demo
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto min-w-[200px]">
                  Create Account
                </Button>
              </Link>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="text-4xl mb-4">✅</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Smart Priorities</h3>
                <p className="text-gray-600">
                  Organize tasks by priority levels and focus on what matters most
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="text-4xl mb-4">📅</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Due Dates</h3>
                <p className="text-gray-600">
                  Set deadlines and never miss important tasks with visual indicators
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Advanced Filters</h3>
                <p className="text-gray-600">
                  Filter by status, priority, tags, and search to find tasks instantly
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="text-4xl mb-4">🔄</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Recurring Tasks</h3>
                <p className="text-gray-600">
                  Set up daily, weekly, or monthly recurring tasks automatically
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="text-4xl mb-4">🏷️</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Custom Tags</h3>
                <p className="text-gray-600">
                  Organize and categorize tasks with custom tags for easy management
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Dashboard</h3>
                <p className="text-gray-600">
                  Track your progress with metrics and today's focus view
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-gray-600">
        <p className="mb-2">&copy; 2025 Todo App.</p>
        <p className="text-sm">Developed by <span className="font-semibold text-blue-600">Wania A.</span></p>
      </footer>
    </div>
  );
}
