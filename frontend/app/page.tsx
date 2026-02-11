"use client";

import Link from "next/link";
import { CheckSquare, Tags, BarChart3, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/hooks";

const features = [
  {
    icon: CheckSquare,
    title: "Task Management",
    description:
      "Create, organize, and track your tasks with priorities, due dates, and status updates.",
  },
  {
    icon: Tags,
    title: "Smart Tagging",
    description:
      "Categorize tasks with custom tags for quick filtering and better organization.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description:
      "Visualize your productivity with charts and insights on task completion trends.",
  },
];

export default function HeroPage() {
  const { isAuthenticated, user, isLoading } = useAuth();

  // Authenticated: show welcome-back prompt
  if (!isLoading && isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] animate-fade-in-up">
        <div className="glass rounded-2xl p-10 text-center max-w-md space-y-6">
          <div className="mx-auto w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
            <Sparkles className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome back{user?.name ? `, ${user.name}` : ""}!
          </h1>
          <p className="text-muted-foreground">
            Ready to stay on top of your tasks?
          </p>
          <Link href="/tasks">
            <Button size="lg" className="gap-2 rounded-xl shadow-md">
              Go to Dashboard
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      {/* Hero section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 auth-gradient opacity-[0.06] dark:opacity-[0.12]" />
        <div className="container relative py-24 sm:py-32 flex flex-col items-center text-center gap-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-3xl leading-[1.1]">
            Stay organized.{" "}
            <span className="gradient-text">Get things done.</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl">
            A modern task manager with priorities, tags, and analytics — built
            to help you focus on what matters most.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/signup">
              <Button
                size="lg"
                className="gap-2 rounded-xl shadow-md text-base px-8"
              >
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button
                variant="outline"
                size="lg"
                className="rounded-xl text-base px-8"
              >
                Log in
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="container py-20">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-center mb-12">
          Everything you need to be productive
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="glass rounded-xl p-6 space-y-4 card-hover"
              >
                <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA banner */}
      <section className="container pb-24">
        <div className="auth-gradient rounded-2xl p-10 sm:p-14 text-center text-primary-foreground space-y-6 max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Ready to get organized?
          </h2>
          <p className="text-primary-foreground/80 max-w-lg mx-auto">
            Join today and start managing your tasks with a clean, modern
            interface designed for focus.
          </p>
          <Link href="/signup">
            <Button
              size="lg"
              variant="secondary"
              className="gap-2 rounded-xl text-base px-8 shadow-md"
            >
              Create free account
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
