"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { ECellLogo } from "./ECellLogo";

interface GlassHeaderProps {
  query: string;
  onQueryChange: (value: string) => void;
}

/**
 * Sticky, glassmorphic top navigation. Royal-blue E-Cell mark on the left; an
 * always-visible search field on the right that filters the feed as you type.
 *
 * The input is `type="text"` (not `"search"`) so the browser's native clear
 * button doesn't show — we render a single custom clear "×" that appears only
 * when there's text.
 */
export function GlassHeader({ query, onQueryChange }: GlassHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/20 bg-white/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <ECellLogo className="h-9 w-9 shrink-0" />
          <div className="leading-tight">
            <p className="text-sm font-semibold text-slate-900">E-Cell News</p>
            <p className="text-[11px] text-slate-500">Shiv Nadar University</p>
          </div>
        </div>

        <div className="flex w-40 items-center gap-2 rounded-full border border-white/40 bg-white/70 px-3 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl transition-colors focus-within:bg-white sm:w-60 lg:w-72">
          <Search className="h-4 w-4 shrink-0 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Escape") onQueryChange("");
            }}
            placeholder="Search stories…"
            aria-label="Search stories"
            className="h-10 w-full min-w-0 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
          />
          <AnimatePresence initial={false}>
            {query && (
              <motion.button
                key="clear"
                type="button"
                onClick={() => onQueryChange("")}
                aria-label="Clear search"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                className="shrink-0 text-slate-400 transition-colors hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
