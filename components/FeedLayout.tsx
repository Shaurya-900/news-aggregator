"use client";

import { AnimatePresence } from "framer-motion";
import { NewsCard } from "./NewsCard";
import type { Article } from "@/lib/types";

interface FeedLayoutProps {
  articles: Article[];
}

/**
 * Responsive feed grid: 1 column on mobile, 2 on tablet, 3 on desktop.
 *
 * <AnimatePresence mode="popLayout"> lets cards that leave the current filter
 * animate out while incoming cards stagger in (entrance delay lives in
 * NewsCard, keyed off its index), without exiting items disrupting the grid.
 */
export function FeedLayout({ articles }: FeedLayoutProps) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      {articles.length === 0 ? (
        <div className="grid place-items-center py-24 text-center">
          <p className="text-sm text-slate-400">
            No stories match — try a different category or search.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {articles.map((article, index) => (
              <NewsCard key={article.id} article={article} index={index} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
