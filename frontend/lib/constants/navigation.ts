import { LayoutDashboard, Tags, BarChart3, type LucideIcon } from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/tasks", label: "Tasks", icon: LayoutDashboard },
  { href: "/tags", label: "Tags", icon: Tags },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
];
