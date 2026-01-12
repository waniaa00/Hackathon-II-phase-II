'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Logo } from './Logo';
import { NavbarProps } from '@/app/lib/types';
import { useSession, signOut } from '@/lib/auth';

export function Navbar({ currentPath }: NavbarProps) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Use the new Better-Auth session hook
  const { data: session } = useSession();
  const user = session?.user || null;

  const navLinks = [
    { href: '/todos', label: 'All Tasks' },
    { href: '/dashboard', label: 'Dashboard' },
  ];

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
    router.refresh(); // Refresh to update auth context
  };

  return (
    <nav className="sticky top-0 bg-white shadow-md z-10">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/todos">
            <Logo size="medium" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-3">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded hover:bg-gray-100 transition text-gray-800 font-medium ${
                  currentPath === link.href ? 'bg-gray-100 font-semibold' : ''
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-l border-gray-300 h-6 mx-1"></div>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {(user.name || user.email?.split('@')[0]).charAt(0).toUpperCase()}
                  </div>
                  <span className="text-gray-700 font-medium">{user.name || user.email?.split('@')[0]}</span>
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-sm font-semibold text-gray-800">{user.name || user.email?.split('@')[0]}</p>
                      <p className="text-xs text-gray-600">{user.email}</p>
                    </div>
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        handleSignOut();
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="px-3 py-2 text-gray-700 hover:text-gray-900 font-medium"
              >
                Login
              </Link>
            )}

            <Link
              href="/todos"
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-sm hover:shadow-lg active:scale-95"
            >
              Add Task
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2 text-gray-800"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 border-t pt-2">
            {user && (
              <div className="px-3 py-2 mb-2 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {(user.name || user.email?.split('@')[0]).charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{user.name || user.email?.split('@')[0]}</p>
                    <p className="text-xs text-gray-600">{user.email}</p>
                  </div>
                </div>
              </div>
            )}

            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-3 py-2 rounded hover:bg-gray-100 text-gray-800 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {user ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleSignOut();
                }}
                className="block w-full text-left px-3 py-2 rounded text-red-600 hover:bg-red-50 font-medium"
              >
                Sign Out
              </button>
            ) : (
              <Link
                href="/login"
                className="block px-3 py-2 rounded hover:bg-gray-100 text-gray-800 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
            )}

            <Link
              href="/todos"
              className="block px-5 py-2.5 mt-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 text-center font-semibold shadow-sm transition-all duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              Add Task
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
