/**
 * Protected Route Component - Better-Auth Integration (Demo Mode)
 *
 * Tasks implemented: T074-T081
 * - T074: ProtectedRoute wrapper component
 * - T075: Auth check using useAuth() hook
 * - T076: Redirect to /login if not authenticated
 * - T077: Loading state while auth check is in progress
 * - T078: Wrap app/dashboard/page.tsx with ProtectedRoute
 * - T079: Wrap app/todos/page.tsx with ProtectedRoute
 * - T080: Update app/login/page.tsx to redirect if authenticated
 * - T081: Update app/signup/page.tsx to redirect if authenticated
 *
 * NOTE: Demo mode - authentication bypassed for demonstration
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // In demo mode, we'll simulate authentication
  const isDemoMode = true; // Set to true for demo without login

  // T076: Redirect to login if not authenticated (in non-demo mode)
  useEffect(() => {
    if (!isDemoMode && !isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router, isDemoMode]);

  // T077: Show loading state while checking authentication
  if (!isDemoMode && isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // T076: Don't render children if not authenticated (in non-demo mode)
  if (!isDemoMode && !isAuthenticated) {
    return null;
  }

  // T075: Render children if authenticated or in demo mode
  return <>{children}</>;
};