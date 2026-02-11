"use client";

import { XCircle, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ErrorMessageProps {
  message: string;
  type?: "error" | "warning" | "info";
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function ErrorMessage({
  message,
  type = "error",
  action,
  className,
}: ErrorMessageProps) {
  const icons = {
    error: XCircle,
    warning: AlertTriangle,
    info: Info,
  };

  const colors = {
    error: "bg-destructive/10 text-destructive border-destructive/20",
    warning: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    info: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  };

  const Icon = icons[type];

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-xl border p-4 shadow-sm animate-fade-in-up",
        colors[type],
        className
      )}
      role="alert"
    >
      <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
      <p className="flex-1 text-sm leading-relaxed">{message}</p>
      {action && (
        <Button
          variant="outline"
          size="sm"
          onClick={action.onClick}
          className="shrink-0 rounded-lg"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}
