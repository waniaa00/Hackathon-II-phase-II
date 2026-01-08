'use client'

import { TaskProvider } from '@/app/context/TaskContext'

export function Providers({ children }: { children: React.ReactNode }) {
  return <TaskProvider>{children}</TaskProvider>
}
