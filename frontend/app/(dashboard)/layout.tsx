"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { NAV_ITEMS } from "@/lib/constants/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname.startsWith(href);

  return (
    <>
      {/* Main content */}
      <div className="container py-8 pb-24 md:pb-8">{children}</div>

      {/* Mobile bottom navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass border-t border-border/50 safe-area-bottom">
        <div className="container flex items-center justify-around py-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "flex-col gap-1 h-auto py-2 rounded-xl transition-all",
                    active
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs font-medium">{item.label}</span>
                </Button>
              </Link>
            );
          })}
          <Link href="/tasks/new">
            <Button
              size="sm"
              className="flex-col gap-1 h-auto py-2 rounded-xl shadow-sm"
            >
              <Plus className="h-5 w-5" />
              <span className="text-xs font-medium">Add</span>
            </Button>
          </Link>
        </div>
      </nav>
    </>
  );
}
