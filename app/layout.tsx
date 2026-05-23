import type { Metadata } from "next";
import "./globals.css";
import { AmbientBackground } from "@/components/shell/ambient-background";

export const metadata: Metadata = {
  title: "HABITS | Futuristic Habit OS",
  description: "A cyberpunk self-improvement operating system for habits, focus, XP, and personal progress."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>
        <AmbientBackground />
        {children}
      </body>
    </html>
  );
}
