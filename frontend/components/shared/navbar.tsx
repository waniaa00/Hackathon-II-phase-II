"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ListTodo, Plus, Menu, Settings } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LogoutButton } from "@/components/auth/logout-button";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { useAuth } from "@/lib/auth/hooks";
import { NAV_ITEMS } from "@/lib/constants/navigation";

const AUTH_ROUTES = ["/", "/login", "/signup"];

export function Navbar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [sheetOpen, setSheetOpen] = useState(false);

  const isAuthPage = AUTH_ROUTES.includes(pathname);

  const isActive = (href: string) =>
    pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 glass border-b border-border/50">
      <div className="container flex h-16 items-center justify-between">
        {/* Left: Logo + nav links */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="p-1.5 bg-primary rounded-lg group-hover:shadow-md transition-shadow">
              <ListTodo className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg gradient-text">Taskify</span>
          </Link>

          {/* Desktop nav links — shown on non-auth pages */}
          {!isAuthPage && (
            <nav className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={active ? "default" : "ghost"}
                      size="sm"
                      className={cn(
                        "gap-2 rounded-lg transition-all",
                        active ? "shadow-sm" : "hover:bg-accent"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </nav>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {!isAuthPage && (
            <>
              {/* Desktop actions */}
              <div className="hidden md:flex items-center gap-3">
                <Link href="/tasks/new">
                  <Button size="sm" className="gap-2 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">New Task</span>
                  </Button>
                </Link>
                <div className="h-6 w-px bg-border/60" />
                <Link href="/settings">
                  <Button variant="ghost" size="icon" className="rounded-lg">
                    <Settings className="h-4 w-4" />
                    <span className="sr-only">Settings</span>
                  </Button>
                </Link>
                <LogoutButton variant="ghost" showIcon={false} />
              </div>

              {/* Mobile hamburger */}
              <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden rounded-lg">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-72">
                  <SheetHeader>
                    <SheetTitle className="text-left">
                      {user?.name ? `Hi, ${user.name}` : "Menu"}
                    </SheetTitle>
                  </SheetHeader>
                  <nav className="flex flex-col gap-2 mt-6">
                    {NAV_ITEMS.map((item) => {
                      const Icon = item.icon;
                      const active = isActive(item.href);
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setSheetOpen(false)}
                        >
                          <Button
                            variant={active ? "default" : "ghost"}
                            className="w-full justify-start gap-3"
                          >
                            <Icon className="h-4 w-4" />
                            {item.label}
                          </Button>
                        </Link>
                      );
                    })}
                    <Link href="/tasks/new" onClick={() => setSheetOpen(false)}>
                      <Button className="w-full justify-start gap-3 mt-2">
                        <Plus className="h-4 w-4" />
                        New Task
                      </Button>
                    </Link>
                    <div className="border-t border-border/50 my-2" />
                    <Link href="/settings" onClick={() => setSheetOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start gap-3">
                        <Settings className="h-4 w-4" />
                        Settings
                      </Button>
                    </Link>
                    <LogoutButton variant="ghost" className="w-full justify-start" />
                  </nav>
                </SheetContent>
              </Sheet>
            </>
          )}

          {isAuthPage && (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant={pathname === "/login" ? "default" : "ghost"} size="sm">
                  Log in
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant={pathname === "/signup" ? "default" : "ghost"} size="sm">
                  Sign up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
