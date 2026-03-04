"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, ArrowRight, Github, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase-client";

const features = [
  "Unlimited screen recordings",
  "AI-powered guide generation",
  "Custom branding & themes",
  "Team collaboration tools",
];

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [oauthLoading, setOauthLoading] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            full_name: `${firstName} ${lastName}`,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      if (data?.user) {
        // Hard-redirect directly to dashboard because email confirmations are OFF
        window.location.href = "/dashboard";
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: "google" | "github") => {
    setError(null);
    setOauthLoading(provider);

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (authError) {
        setError(authError.message);
        setOauthLoading(null);
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setOauthLoading(null);
    }
  };



  return (
    <Card className="border-zinc-800/50">
      <CardContent className="p-8">
        <div className="mb-6 text-center">
          <h2 className="text-xl font-semibold text-foreground">
            Create your account
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Start your free trial. No credit card required.
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Social Signup */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            size="md"
            className="w-full"
            onClick={() => handleOAuth("google")}
            disabled={oauthLoading !== null || loading}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            {oauthLoading === "google" ? "Connecting..." : "Google"}
          </Button>
          <Button
            variant="outline"
            size="md"
            className="w-full"
            onClick={() => handleOAuth("github")}
            disabled={oauthLoading !== null || loading}
          >
            <Github className="h-4 w-4" />
            {oauthLoading === "github" ? "Connecting..." : "GitHub"}
          </Button>
        </div>

        <div className="relative my-6">
          <Separator />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-xs text-muted-foreground">
            or continue with email
          </span>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label htmlFor="firstName" className="text-sm font-medium text-foreground">
                First name
              </label>
              <Input
                id="firstName"
                name="firstName"
                placeholder="John"
                icon={<User className="h-4 w-4" />}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="lastName" className="text-sm font-medium text-foreground">
                Last name
              </label>
              <Input id="lastName" name="lastName" placeholder="Doe" required />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-foreground">
              Work email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@company.com"
              icon={<Mail className="h-4 w-4" />}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-foreground">
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Create a strong password"
              icon={<Lock className="h-4 w-4" />}
              required
              minLength={8}
            />
            <p className="text-xs text-muted-foreground">
              Must be at least 8 characters
            </p>
          </div>

          <Button
            type="submit"
            className="w-full"
            loading={loading}
            disabled={oauthLoading !== null}
          >
            Create Account
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>

        {/* Features */}
        <div className="mt-6 rounded-lg bg-muted/50 p-4">
          <p className="mb-2 text-xs font-medium text-foreground">
            Included in your free trial:
          </p>
          <ul className="space-y-1.5">
            {features.map((feature) => (
              <li
                key={feature}
                className="flex items-center gap-2 text-xs text-muted-foreground"
              >
                <Check className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="font-medium text-primary hover:underline"
          >
            Sign in
          </Link>
        </p>

        <p className="mt-4 text-center text-[11px] text-zinc-600">
          By signing up, you agree to our{" "}
          <Link href="/terms" className="underline hover:text-zinc-400">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline hover:text-zinc-400">
            Privacy Policy
          </Link>
          .
        </p>
      </CardContent>
    </Card>
  );
}
