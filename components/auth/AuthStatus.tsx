/**
 * Authentication Status Component - Better-Auth Integration
 *
 * Tasks implemented: T082-T088
 * - T082: AuthStatus component to display user info or login/signup buttons
 * - T083: Conditional rendering based on isAuthenticated from useAuth()
 * - T084: Display user email or name when authenticated
 * - T085: Display login and signup buttons when not authenticated
 * - T086: Include logout button when authenticated (reuse LogoutButton component)
 * - T087: Add AuthStatus component to app/layout.tsx navigation area
 * - T088: Test UI updates when session expires (shows logged-out state)
 */

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { LogoutButton } from '@/components/auth/LogoutButton';

export const AuthStatus = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center space-x-4">
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      {isAuthenticated ? (
        // T084: Display user info when authenticated
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-700">
            Welcome, <span className="font-medium">{user?.name || user?.email?.split('@')[0]}</span>
          </div>

          {/* T086: Include logout button when authenticated */}
          <LogoutButton className="text-sm px-3 py-1 bg-red-600 hover:bg-red-700" />
        </div>
      ) : (
        // T085: Display login/signup buttons when not authenticated
        <div className="flex items-center space-x-3">
          <Link
            href="/login"
            className="text-sm text-gray-700 hover:text-gray-900 font-medium"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Sign Up
          </Link>
        </div>
      )}
    </div>
  );
};