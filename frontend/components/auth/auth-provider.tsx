"use client";

import { ReactNode } from "react";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  // Better Auth handles session management internally
  // This provider is a wrapper for future enhancements
  return <>{children}</>;
}
