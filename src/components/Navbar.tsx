"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navItems } from "@/data/navigation";
import { profile } from "@/data/profile";
import SocialLinks from "./SocialLinks";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lastPathname, setLastPathname] = useState(pathname);

  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    if (open) setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/" || pathname === "";
    return pathname.startsWith(href);
  };

  return (
    <nav
      aria-label="Primary"
      className="fixed top-0 left-0 right-0 z-50 nav-bg backdrop-blur-sm border-b border-surface-300"
    >
      <div className="max-w-[930px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-12 sm:h-14">
        <div className="min-w-0 flex-shrink">
          <SocialLinks
            socials={profile.socials}
            size="md"
            className="sm:hidden"
          />
          <SocialLinks
            socials={profile.socials}
            size="lg"
            className="hidden sm:flex"
          />
        </div>

        <div className="hidden md:flex items-center gap-5 lg:gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-lg transition-colors ${
                isActive(item.href)
                  ? "text-accent font-medium"
                  : "text-text-primary hover:text-accent"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-1 sm:gap-2 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="p-2 -mr-2 text-text-primary hover:text-accent transition-colors touch-manipulation"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              {open ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div
          id="mobile-menu"
          className="md:hidden border-t border-surface-300 nav-bg backdrop-blur-sm"
        >
          <div className="px-4 sm:px-6 py-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`block py-2.5 text-lg transition-colors ${
                  isActive(item.href)
                    ? "text-accent font-medium"
                    : "text-text-primary hover:text-accent"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
