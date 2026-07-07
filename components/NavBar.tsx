"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Week" },
  { href: "/habits", label: "Habits" },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <header className="border-b border-black/10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-6">
        <span className="font-semibold tracking-tight">Dashboard</span>
        <nav className="flex gap-1">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  active
                    ? "bg-black/90 text-white"
                    : "text-black/60 hover:bg-black/5"
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
