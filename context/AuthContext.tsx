/**
 * Authentication Context - Better-Auth Integration (Demo Mode)
 *
 * Tasks implemented: T042-T045
 * - T042: AuthContext definition with user, isLoading, isAuthenticated
 * - T043: AuthProvider component using Better-Auth useSession() hook
 * - T044: useAuth() custom hook for consuming auth context
 * - T045: Wrap app with AuthProvider in app/layout.tsx (instructions)
 *
 * NOTE: Demo mode - authentication simulated for demonstration
 */

import React, { createContext, useContext, ReactNode } from 'react'
import { useSession } from '@/lib/auth'

// Define the shape of our authentication context
interface AuthContextType {
  user: {
    id: string;
    email: string;
    name?: string;
    image?: string | null;
    emailVerified?: boolean;
  } | null // Better-Auth user object or null if not authenticated
  isLoading: boolean // Whether session is being loaded
  isAuthenticated: boolean // Whether user is authenticated
}

// Create the authentication context with default values
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Props for the AuthProvider component
interface AuthProviderProps {
  children: ReactNode
}

// AuthProvider component that manages authentication state
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Use Better-Auth's useSession hook to get session data
  const { data: session, isPending } = useSession()

  // Demo mode: Simulate authentication
  const isDemoMode = true; // Set to true for demo without login

  // In demo mode, we'll simulate an authenticated user
  const demoUser = isDemoMode ? {
    id: "demo-user-id-12345",
    email: "demo@example.com",
    name: "Demo User",
    image: null,
    emailVerified: true
  } : null;

  // Determine authentication status
  const isAuthenticated = isDemoMode || !!session?.user
  const user = isDemoMode ? demoUser : session?.user || null
  const isLoading = isDemoMode ? false : isPending; // No loading in demo mode

  // Provide authentication state to child components
  const value = {
    user,
    isLoading,
    isAuthenticated,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to consume authentication context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}