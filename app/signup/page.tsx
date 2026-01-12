"use client"

/**
 * User Registration Page - Better-Auth Integration
 *
 * Tasks implemented: T019-T027, T081, T093, T095
 * - T019: Signup page with form
 * - T020: Better-Auth client integration
 * - T021: Form state management
 * - T022: Client-side validation
 * - T023: Inline error display
 * - T024: Loading indicator
 * - T025: Better-Auth signUp connection
 * - T026: Error handling for duplicate email
 * - T027: Redirect to dashboard
 * - T081: Redirect to /dashboard if already authenticated
 * - T093: Use normalized error messages from lib/errors.ts
 * - T095: Use ErrorAlert component for displaying error messages
 */

import { useState, FormEvent, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { signUp } from '@/lib/auth'
import { useAuth } from '@/context/AuthContext'
import { normalizeError } from '@/lib/errors'
import { ErrorAlert } from '@/components/ui/ErrorAlert'
import Link from 'next/link'

export default function SignupPage() {
  // T021: Form state management
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // T081: Check if user is already authenticated
  const { isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, isLoading, router])

  // T022: Client-side validation
  const validateEmail = (email: string): string | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) return 'Email is required'
    if (!emailRegex.test(email)) return 'Invalid email format'
    return null
  }

  const validatePassword = (password: string): string | null => {
    if (!password) return 'Password is required'
    if (password.length < 8) return 'Password must be at least 8 characters'
    if (!/[A-Z]/.test(password)) return 'Password must contain an uppercase letter'
    if (!/[0-9]/.test(password)) return 'Password must contain a digit'
    return null
  }

  // T025-T027: Form submission with Better-Auth, error handling, redirect
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    // Validate before submission
    const emailError = validateEmail(email)
    const passwordError = validatePassword(password)

    if (emailError || passwordError) {
      setError(emailError || passwordError || '')
      return
    }

    setLoading(true) // T024: Loading indicator

    try {
      // T025: Connect to Better-Auth signup
      const signupData: any = { email, password };
      if (name.trim()) {
        signupData.name = name.trim();
      }
      await signUp.email(signupData)

      // T027: Redirect to dashboard after successful signup
      router.push('/dashboard')
    } catch (err: unknown) {
      setLoading(false)

      // T093: Use normalized error messages
      const normalizedError = normalizeError(err, 'auth')
      setError(normalizedError)
    }
  }

  // T081: Don't render form if loading or already authenticated
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-lg">Checking authentication...</div>
      </div>
    )
  }

  if (isAuthenticated) {
    return null // Redirect effect will handle navigation
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
              sign in to your existing account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* T095: Use ErrorAlert component for displaying error messages */}
          {error && <ErrorAlert message={error} variant="error" />}

          <div className="rounded-md shadow-sm space-y-4">
            {/* Name field (optional) */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name (optional)
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="John Doe"
              />
            </div>

            {/* Email field with validation */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setError('')
                }}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="you@example.com"
              />
            </div>

            {/* Password field with validation */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password *
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError('')
                }}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Minimum 8 characters, uppercase, digit"
              />
              <p className="mt-1 text-xs text-gray-500">
                Must be at least 8 characters with uppercase letter and digit
              </p>
            </div>
          </div>

          {/* T024: Submit button with loading state */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </>
              ) : (
                'Create account'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
