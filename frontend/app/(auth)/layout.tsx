import { Suspense } from "react";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { ListTodo } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 min-h-0">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 auth-gradient relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyem0wLTRWMjhIMjR2MmgxMnptMC00VjI0SDI0djJoMTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
        <div className="relative z-10 text-white max-w-md space-y-8 animate-fade-in-up">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/15 rounded-2xl backdrop-blur-sm">
              <ListTodo className="h-10 w-10" />
            </div>
            <h1 className="text-4xl font-bold">Todo App</h1>
          </div>
          <p className="text-xl text-white/80 leading-relaxed">
            Organize your life, one task at a time. Stay focused, stay productive.
          </p>
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-3 text-white/70">
              <div className="h-2 w-2 rounded-full bg-white/60" />
              <span>Smart task management with priorities</span>
            </div>
            <div className="flex items-center gap-3 text-white/70">
              <div className="h-2 w-2 rounded-full bg-white/60" />
              <span>Custom tags and filters</span>
            </div>
            <div className="flex items-center gap-3 text-white/70">
              <div className="h-2 w-2 rounded-full bg-white/60" />
              <span>Recurring tasks and reminders</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6 bg-background">
        <Suspense
          fallback={
            <div className="flex items-center justify-center">
              <LoadingSpinner size="lg" />
            </div>
          }
        >
          <div className="w-full max-w-md animate-fade-in-up">
            {children}
          </div>
        </Suspense>
      </div>
    </div>
  );
}
