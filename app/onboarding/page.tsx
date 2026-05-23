"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Brain, CalendarCheck, Palette, ShieldCheck, Target, Zap } from "lucide-react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { NeonPanel } from "@/components/neon-panel";
import { Progress } from "@/components/ui/progress";

const steps = [
  { icon: Target, title: "Choose your systems", text: "Pick habits for mind, body, focus, craft, and recovery." },
  { icon: Zap, title: "Set XP difficulty", text: "Easy grants 10 XP, medium 25 XP, hard 50 XP." },
  { icon: CalendarCheck, title: "Schedule your loop", text: "Daily, weekly, and custom cadence previews are ready." },
  { icon: Palette, title: "Tune the atmosphere", text: "Neon themes, glow intensity, reminders, and sound placeholders." }
];

export default function OnboardingPage() {
  return (
    <main className="relative z-10 min-h-screen px-4 py-6 sm:px-6 lg:px-10">
      <nav className="mx-auto flex max-w-6xl items-center justify-between">
        <Logo />
        <Button asChild variant="ghost">
          <Link href="/">Back</Link>
        </Button>
      </nav>
      <section className="mx-auto grid max-w-6xl gap-6 py-12 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
        <div>
          <p className="font-display text-xs font-bold uppercase tracking-[0.3em] text-cyan">Onboarding</p>
          <h1 className="mt-4 pixel-title text-4xl font-black uppercase text-white sm:text-6xl">Calibrate your operating system</h1>
          <p className="mt-5 text-slate-300">
            This frontend flow stages the habit setup experience with mock data, interactive choices, and a premium native-app feel.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/dashboard">Complete Setup</Link>
            </Button>
            <Button asChild variant="cyan">
              <Link href="/focus">Try Focus Mode</Link>
            </Button>
          </div>
        </div>
        <NeonPanel title="Setup Sequence" kicker="4 Steps">
          <div className="space-y-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="rounded-lg border border-pulse/30 bg-black/25 p-4"
                >
                  <div className="flex gap-4">
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg border border-cyan/40 bg-cyan/10 shadow-cyan">
                      <Icon className="h-6 w-6 text-cyan" />
                    </div>
                    <div>
                      <h2 className="font-display text-sm font-black uppercase text-white">{step.title}</h2>
                      <p className="mt-1 text-sm text-slate-400">{step.text}</p>
                    </div>
                  </div>
                  <Progress value={(index + 1) * 25} className="mt-4" />
                </motion.div>
              );
            })}
          </div>
        </NeonPanel>
      </section>
      <section className="mx-auto grid max-w-6xl gap-5 md:grid-cols-3">
        {[
          ["Private by default", ShieldCheck],
          ["Cognitive clarity", Brain],
          ["Dopamine-friendly XP", Zap]
        ].map(([label, Icon]) => {
          const ItemIcon = Icon as typeof ShieldCheck;
          return (
            <NeonPanel key={label as string} className="text-center">
              <ItemIcon className="mx-auto h-8 w-8 text-pulse" />
              <p className="mt-4 font-display text-sm font-black uppercase text-white">{label as string}</p>
            </NeonPanel>
          );
        })}
      </section>
    </main>
  );
}
