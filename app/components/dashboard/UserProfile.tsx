'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authClient, User } from '@/lib/auth-client';
import { Button } from '@/app/components/ui/Button';

export function UserProfile() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      const { data } = await authClient.getSession();
      setUser(data?.user || null);
      setIsLoading(false);

      if (!data?.user) {
        router.push('/login');
      }
    };

    loadSession();
  }, [router]);

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push('/welcome');
  };

  if (isLoading) {
    return (
      <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/10">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-700/50 rounded w-3/4 mb-4"></div>
          <div className="h-3 bg-gray-700/50 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const displayName = user.name || user.email.split('@')[0];
  const memberSince = user.created_at
    ? new Date(user.created_at).toLocaleDateString()
    : new Date().toLocaleDateString();

  return (
    <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/10">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
          {displayName.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-white">{displayName}</h2>
          <p className="text-sm text-gray-400">{user.email}</p>
        </div>
      </div>

      <div className="space-y-3 pt-4 border-t border-white/20">
        <div className="text-xs text-gray-500">
          Member since: {memberSince}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleSignOut}
          className="w-full border-white/30 text-white hover:bg-white/10"
        >
          Sign Out
        </Button>
      </div>
    </div>
  );
}
