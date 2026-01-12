/**
 * Logout Button Component - Better-Auth Integration
 *
 * Tasks implemented: T065-T069
 * - T065: LogoutButton component with logout button and click handler
 * - T066: Logout click handler using Better-Auth signOut() function
 * - T067: Redirect to /login after successful logout
 * - T068: Add LogoutButton component to navigation (instructions)
 * - T069: Add loading state to LogoutButton during logout request
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signOut } from '@/lib/auth'

interface LogoutButtonProps {
  children?: React.ReactNode
  className?: string
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({
  children = 'Logout',
  className = ''
}) => {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    setLoading(true)

    try {
      // T066: Use Better-Auth signOut function
      await signOut()

      // T067: Redirect to login after successful logout
      router.push('/login')
      router.refresh() // Refresh to update auth context
    } catch (error) {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className={`px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {loading ? (
        <span className="flex items-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Logging out...
        </span>
      ) : (
        children
      )}
    </button>
  )
}