import { ListTodo } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/50 backdrop-blur-sm">
      <div className="container flex h-14 items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <ListTodo className="h-4 w-4 text-primary" />
          <span className="font-medium">Todo App</span>
        </div>
        <p>&copy; {new Date().getFullYear()} Wania. All rights reserved.</p>
      </div>
    </footer>
  );
}
