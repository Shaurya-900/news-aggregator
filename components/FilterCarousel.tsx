"use client";

import { motion } from "framer-motion";
import type { Filter } from "@/lib/types";

interface FilterCarouselProps {
  categories: readonly Filter[];
  active: Filter;
  onChange: (category: Filter) => void;
}

/**
 * Horizontally scrolling category filter that sits below the header.
 * The active chip inverts to solid royal blue; a shared `layoutId` pill
 * slides smoothly between selections via Framer Motion.
 */
export function FilterCarousel({
  categories,
  active,
  onChange,
}: FilterCarouselProps) {
  return (
    <div className="sticky top-16 z-40 border-b border-slate-200/50 bg-slate-50/80 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div
          role="tablist"
          aria-label="Filter news by category"
          className="no-scrollbar flex gap-2 overflow-x-auto py-3"
        >
          {categories.map((category) => {
            const isActive = category === active;
            return (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onChange(category)}
                className="relative shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-royal/40"
              >
                {isActive && (
                  <motion.span
                    layoutId="filter-pill"
                    className="absolute inset-0 rounded-full bg-royal shadow-[0_8px_20px_rgba(66,103,178,0.35)]"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <span
                  className={
                    isActive
                      ? "relative z-10 text-white"
                      : "relative z-10 text-slate-600 hover:text-slate-900"
                  }
                >
                  {category}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
