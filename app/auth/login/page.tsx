"use client";

import Link from "next/link";
import { useState } from "react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NeonPanel } from "@/components/neon-panel";
import { login } from "@/app/auth/actions";
import { Zap } from "lucide-react";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = await login(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <main className="relative z-10 min-h-screen px-4 py-6 sm:px-6 lg:px-10 flex flex-col">
      <nav className="mx-auto flex w-full max-w-lg items-center justify-center">
        <Logo />
      </nav>
      <div className="flex-1 flex flex-col items-center justify-center mt-10">
        <NeonPanel title="Access Terminal" kicker="Authentication" className="w-full max-w-md">
          <form action={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label className="text-xs uppercase text-slate-400 mb-1 block">Email</label>
              <Input type="email" name="email" required placeholder="operative@system.net" />
            </div>
            <div>
              <label className="text-xs uppercase text-slate-400 mb-1 block">Password</label>
              <Input type="password" name="password" required placeholder="••••••••" />
            </div>
            {error && (
              <p className="text-xs text-danger uppercase font-bold">{error}</p>
            )}
            <Button type="submit" variant="cyan" className="w-full mt-2" disabled={loading}>
              <Zap className="h-4 w-4 mr-2" />
              {loading ? "Authenticating..." : "Initialize Session"}
            </Button>
          </form>
        </NeonPanel>
      </div>
    </main>
  );
}
