'use client'

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useTaskContext } from '@/app/context/TaskContext';
import { calculateMetrics, getTodaysFocusTasks } from '@/app/lib/dashboardUtils';
import { SummaryCards } from '@/app/components/dashboard/SummaryCards';
import { TodaysFocus } from '@/app/components/dashboard/TodaysFocus';
import { QuickActions } from '@/app/components/dashboard/QuickActions';
import { UserProfile } from '@/app/components/dashboard/UserProfile';
import { Navbar } from '@/app/components/layout/Navbar';
import { Footer } from '@/app/components/layout/Footer';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function DashboardPage() {
  const { state, dispatch } = useTaskContext();
  const router = useRouter();

  // Memoized metrics calculation
  const metrics = useMemo(
    () => calculateMetrics(state.tasks),
    [state.tasks]
  );

  // Memoized today's focus filtering
  const todaysTasks = useMemo(
    () => getTodaysFocusTasks(state.tasks),
    [state.tasks]
  );

  // Handlers
  const handleAddTask = () => {
    router.push('/todos');
  };

  const handleViewAll = () => {
    router.push('/todos');
  };

  const handleClearCompleted = () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${metrics.completed} completed task(s)?`
    );

    if (confirmed) {
      // Dispatch action to clear completed tasks
      const completedIds = state.tasks
        .filter(t => t.completed)
        .map(t => t.id);

      completedIds.forEach(id => {
        dispatch({ type: 'DELETE_TASK', payload: { id } });
      });
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col">
        <Navbar currentPath="/dashboard" />

        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here&apos;s your task overview</p>
          </div>

          {/* Summary Cards */}
          <SummaryCards metrics={metrics} />

          {/* Main Content Grid */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Today's Focus - Takes 2/3 width on desktop */}
            <div className="lg:col-span-2 space-y-6">
              <TodaysFocus tasks={todaysTasks} />
            </div>

            {/* Sidebar - Takes 1/3 width on desktop */}
            <div className="space-y-6">
              <UserProfile />
              <QuickActions
                onAddTask={handleAddTask}
                onViewAll={handleViewAll}
                onClearCompleted={handleClearCompleted}
                completedCount={metrics.completed}
              />
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </ProtectedRoute>
  );
}
