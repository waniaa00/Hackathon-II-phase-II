"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import { isFuture, isToday } from "@/lib/utils/date";
import type { Task } from "@/lib/types";

function getInitialPermission(): NotificationPermission {
  if (typeof globalThis.Notification !== "undefined") {
    return globalThis.Notification.permission;
  }
  return "default";
}

export function useNotifications(tasks: Task[]) {
  const [permission, setPermission] = useState<NotificationPermission>(getInitialPermission);

  const requestPermission = async (): Promise<NotificationPermission> => {
    if (typeof Notification === "undefined") {
      return "denied";
    }

    if (Notification.permission === "granted") {
      setPermission("granted");
      return "granted";
    }

    if (Notification.permission !== "denied") {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result;
    }

    return Notification.permission;
  };

  const showNotification = useCallback((title: string, options?: NotificationOptions) => {
    if (permission !== "granted") {
      // Fallback to toast notification if browser notification permission denied
      toast.info(title);
      return;
    }

    if (typeof Notification !== "undefined") {
      new Notification(title, options);
    } else {
      // Fallback to toast notification if Notification API not supported
      toast.info(title);
    }
  }, [permission]);

  // Track shown notifications to avoid duplicates
  const shownRef = useRef<Set<string>>(new Set());

  // Check for due tasks when tasks change
  useEffect(() => {
    if (tasks.length > 0 && permission === "granted") {
      // Find tasks that are due today or overdue
      const dueTasks = tasks.filter(task => {
        if (!task.due_date) return false;
        // Check if due date is today or in the past
        return isToday(task.due_date) || !isFuture(task.due_date);
      });

      // Show notifications for due tasks
      dueTasks.forEach(task => {
        const tag = `due-task-${task.id}`;
        if (!shownRef.current.has(tag)) {
          shownRef.current.add(tag);
          showNotification(`Task Due: ${task.title}`, {
            body: task.description || "Check this important task",
            tag,
          });
        }
      });
    }
  }, [tasks, permission, showNotification]);

  return {
    permission,
    requestPermission,
    showNotification,
  };
}
