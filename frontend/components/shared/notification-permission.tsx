"use client";

import { useSyncExternalStore, useState } from "react";
import { Bell, BellOff, Settings } from "lucide-react";

import { Button } from "@/components/ui/button";

const emptySubscribe = () => () => {};

function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

function getInitialPermission(): globalThis.NotificationPermission | "default" {
  if (typeof globalThis.Notification !== "undefined") {
    return globalThis.Notification.permission;
  }
  return "default";
}

interface NotificationPermissionProps {
  className?: string;
}

export function NotificationPermission({ className }: NotificationPermissionProps) {
  const mounted = useIsMounted();
  const [permission, setPermission] = useState<globalThis.NotificationPermission | "default">(getInitialPermission);

  const requestPermission = async () => {
    if (typeof Notification !== "undefined") {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result;
    }
    return "denied";
  };

  // Show consistent state during SSR and initial hydration
  if (!mounted) {
    return (
      <Button variant="outline" size="sm" className={className} disabled>
        <Settings className="h-4 w-4 mr-2" />
        Enable Notifications
      </Button>
    );
  }

  if (permission === "granted") {
    return (
      <Button variant="outline" size="sm" className={className}>
        <Bell className="h-4 w-4 mr-2" />
        Notifications Enabled
      </Button>
    );
  }

  if (permission === "denied") {
    return (
      <Button variant="outline" size="sm" className={className}>
        <BellOff className="h-4 w-4 mr-2" />
        Notifications Blocked
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={requestPermission}
      className={className}
    >
      <Settings className="h-4 w-4 mr-2" />
      Enable Notifications
    </Button>
  );
}
