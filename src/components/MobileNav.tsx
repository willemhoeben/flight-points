"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CurrencySelector } from "@/components/CurrencySelector";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { isCurrentSection, type NavLink } from "@/components/NavLinks";
import { useDictionary } from "@/lib/i18n/i18n-context";

/**
 * The phone-width navigation, behind one button.
 *
 * Seven links laid out in the bar itself took three rows, and with tap
 * targets big enough to hit, that header stood 161px tall and stayed there:
 * a fifth of the screen, on every page, permanently. One button gives it
 * back. The links then get 44px rows inside the panel, which is roomier
 * than the bar ever allowed.
 */
export function MobileNav({ links }: { links: NavLink[] }) {
  const dict = useDictionary();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [openedOn, setOpenedOn] = useState(pathname);
  const wrapper = useRef<HTMLDivElement>(null);

  // Next navigates on the client, so the panel would otherwise still be
  // hanging open over the page the visitor just asked for. Adjusted during
  // render rather than in an effect: React re-renders before painting, so
  // the panel is never briefly visible over the new page.
  if (openedOn !== pathname) {
    setOpenedOn(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    function onPointer(e: PointerEvent) {
      if (!wrapper.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  return (
    <div ref={wrapper} className="sm:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        onClick={() => setOpen((v) => !v)}
        className="-mr-1 flex min-h-11 items-center gap-1.5 px-1 text-xs font-medium text-muted hover:text-foreground"
      >
        <span aria-hidden>{open ? "✕" : "≡"}</span>
        {dict.nav.menu}
      </button>

      {/* Absolute rather than in flow: a panel that pushed the page down
          would move the content under the visitor's thumb as it opened. */}
      <div
        id="mobile-nav-panel"
        hidden={!open}
        className="absolute inset-x-0 top-full border-b border-border bg-surface px-4 pb-3 pt-1 shadow-lg"
      >
        <nav className="flex flex-col text-sm font-medium">
          {links.map((link) => {
            const current = isCurrentSection(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={current ? "page" : undefined}
                className={`flex min-h-11 items-center border-b border-border last:border-0 ${
                  current ? "text-brand-text" : "text-foreground"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-3 flex items-center gap-4 border-t border-border pt-3">
          <LanguageSwitcher />
          <CurrencySelector />
        </div>
      </div>
    </div>
  );
}
