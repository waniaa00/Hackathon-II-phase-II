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
    <nav className="sticky top-0 bg-black/20 backdrop-blur-md border-b border-white/10 z-10">
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
                className={`px-3 py-2 rounded-lg transition text-gray-300 font-medium hover:text-white hover:bg-white/10 ${
                  currentPath === link.href ? 'text-white bg-white/20 font-semibold' : ''
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-l border-gray-600 h-6 mx-1"></div>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition text-white"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {(user.name || user.email?.split('@')[0]).charAt(0).toUpperCase()}
                  </div>
                  <span className="text-white font-medium">{user.name || user.email?.split('@')[0]}</span>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-black/80 backdrop-blur-md rounded-xl border border-white/20 py-2 z-50 shadow-2xl">
                    <div className="px-4 py-2 border-b border-white/10">
                      <p className="text-sm font-semibold text-white">{user.name || user.email?.split('@')[0]}</p>
                      <p className="text-xs text-gray-400 truncate">{user.email}</p>
                    </div>
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        handleSignOut();
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="px-3 py-2 text-gray-300 hover:text-white font-medium transition-colors"
              >
                Login
              </Link>
            )}

            <Link
              href="/todos"
              className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl active:scale-95"
            >
              Add Task
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2 text-gray-300 hover:text-white transition-colors"
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
          <div className="md:hidden mt-2 border-t border-white/10 pt-2">
            {user && (
              <div className="px-3 py-2 mb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {(user.name || user.email?.split('@')[0]).charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{user.name || user.email?.split('@')[0]}</p>
                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                  </div>
                </div>
              </div>
            )}

            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-3 py-2 rounded-lg hover:bg-white/10 text-gray-300 font-medium transition-colors hover:text-white"
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
                className="block w-full text-left px-3 py-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 font-medium transition-colors"
              >
                Sign Out
              </button>
            ) : (
              <Link
                href="/login"
                className="block px-3 py-2 rounded-lg hover:bg-white/10 text-gray-300 font-medium transition-colors hover:text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
            )}

            <Link
              href="/todos"
              className="block px-5 py-2.5 mt-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 text-center font-semibold shadow-lg transition-all duration-300"
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
