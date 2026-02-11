"use client";

import { useSession as useBetterAuthSession, signIn, signUp, signOut } from "./client";

export function useSession() {
  const session = useBetterAuthSession();
  return {
    session: session.data,
    isLoading: session.isPending,
    error: session.error,
  };
}

export function useAuth() {
  const { session, isLoading, error } = useSession();

  const handleSignIn = async (email: string, password: string) => {
    const result = await signIn.email({
      email,
      password,
    });
    return result;
  };

  const handleSignUp = async (email: string, password: string, name?: string) => {
    const result = await signUp.email({
      email,
      password,
      name: name || email.split("@")[0],
    });
    return result;
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return {
    session,
    user: session?.user,
    isLoading,
    error,
    isAuthenticated: !!session?.user,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
  };
}
