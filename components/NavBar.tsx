"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ButterflyIcon from "@/components/ButterflyIcon";

const links = [
  { href: "/", label: "Week" },
  { href: "/habits", label: "Habits" },
  { href: "/quarter", label: "Quarter" },
];

function formatToday(): string {
  return new Date().toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function NavBar() {
  const pathname = usePathname();
  // Computed client-side only (not during SSR) so it always reflects the
  // viewer's actual local clock, and refreshed periodically so it doesn't
  // go stale if the tab is left open across midnight.
  const [today, setToday] = useState<string | null>(null);

  useEffect(() => {
    setToday(formatToday());
    const interval = setInterval(() => setToday(formatToday()), 60_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="border-b border-ink/10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-2.5 flex items-center gap-6">
        <div className="flex flex-col justify-center">
          <span className="flex items-center gap-1.5 font-semibold tracking-tight">
            Hey Fiona
            <ButterflyIcon className="w-5 h-5 text-lavender" />
          </span>
          <span className="text-xs text-ink/40 min-h-[1em]">{today}</span>
        </div>
        <nav className="flex gap-1">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  active
                    ? "bg-ink/90 text-white"
                    : "text-ink/60 hover:bg-ink/5"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
