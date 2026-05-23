"use client";

import { Bell, Calendar, CloudOff, Download, Palette, Shield, Upload, Volume2 } from "lucide-react";
import { AppShell } from "@/components/shell/app-shell";
import { NeonPanel } from "@/components/neon-panel";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

export default function SettingsPage() {
  return (
    <AppShell>
      <div className="space-y-5">
        <div>
          <p className="font-display text-xs font-bold uppercase tracking-[0.24em] text-cyan">Preferences</p>
          <h1 className="mt-2 pixel-title text-3xl font-black uppercase text-white">Control room settings</h1>
        </div>
        <div className="grid gap-5 lg:grid-cols-2">
          <NeonPanel title="Custom Themes" kicker="Visual System">
            <div className="grid grid-cols-4 gap-3">
              {["#9f5cff", "#32e6ff", "#ff4fd8", "#42ffba"].map((color) => (
                <button
                  key={color}
                  className="aspect-square rounded-lg border border-white/20"
                  style={{ background: color, boxShadow: `0 0 24px ${color}88` }}
                  aria-label={`Theme ${color}`}
                />
              ))}
            </div>
            <div className="mt-5 flex items-center gap-3 text-sm text-slate-300">
              <Palette className="h-5 w-5 text-pulse" />
              Neon purple is active.
            </div>
          </NeonPanel>
          <NeonPanel title="Notifications" kicker="Reminders UI">
            <SettingsRow icon={Bell} label="Habit reminders" />
            <SettingsRow icon={Volume2} label="Sound effect placeholders" />
            <SettingsRow icon={Shield} label="Streak freeze warnings" />
          </NeonPanel>
          <NeonPanel title="Calendar + Offline" kicker="Integrations">
            <SettingsRow icon={Calendar} label="Calendar integration preview" />
            <SettingsRow icon={CloudOff} label="Offline mode indicator" enabled />
            <div className="mt-4 rounded border border-cyan/30 bg-cyan/10 p-3 text-sm text-cyan">
              No real sync is connected in this frontend phase.
            </div>
          </NeonPanel>
          <NeonPanel title="Data Controls" kicker="Export / Import">
            <div className="flex flex-wrap gap-3">
              <Button variant="ghost">
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Button variant="ghost">
                <Upload className="h-4 w-4" />
                Import
              </Button>
            </div>
            <div className="mt-6">
              <div className="mb-3 flex justify-between text-xs uppercase text-slate-300">
                <span>Glow intensity</span>
                <span>82%</span>
              </div>
              <Slider defaultValue={[82]} max={100} step={1} />
            </div>
          </NeonPanel>
        </div>
      </div>
    </AppShell>
  );
}

function SettingsRow({
  icon: Icon,
  label,
  enabled = true
}: {
  icon: typeof Bell;
  label: string;
  enabled?: boolean;
}) {
  return (
    <div className="mb-3 flex items-center justify-between rounded border border-white/10 bg-black/25 p-3">
      <span className="flex items-center gap-3 text-sm text-slate-200">
        <Icon className="h-4 w-4 text-cyan" />
        {label}
      </span>
      <Switch defaultChecked={enabled} />
    </div>
  );
}
