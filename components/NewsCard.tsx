"use client";

import { motion } from "framer-motion";
import { ArrowIcon } from "./ArrowIcon";
import type { Article } from "@/lib/types";

interface NewsCardProps {
  article: Article;
  /** Index within the current list, used to stagger the entrance animation. */
  index: number;
}

function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * A single news story card. Rounded, white, soft-shadowed. Lifts on hover via
 * CSS transitions; fades/scales in (staggered) and out via Framer Motion so the
 * feed animates gracefully when filters change.
 */
export function NewsCard({ article, index }: NewsCardProps) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.96, y: 14 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { delay: index * 0.045, duration: 0.32, ease: "easeOut" },
      }}
      exit={{ opacity: 0, scale: 0.96, y: -8, transition: { duration: 0.2 } }}
      className="group"
    >
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_18px_40px_rgb(0,0,0,0.08)]"
      >
        {article.image && (
          <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.image}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
            <span className="absolute left-3 top-3 rounded-full border border-white/30 bg-black/30 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-md">
              {article.category}
            </span>
          </div>
        )}

        <div className="flex flex-1 flex-col p-5">
          <div className="mb-2 flex items-center gap-2 text-xs text-slate-400">
            <span className="font-medium text-royal">{article.source}</span>
            <span aria-hidden="true">•</span>
            <time dateTime={article.published_date}>
              {formatDate(article.published_date)}
            </time>
          </div>

          <h3 className="line-clamp-2 text-base font-semibold leading-snug text-slate-900">
            {article.title}
          </h3>

          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-500">
            {article.summary}
          </p>

          <div className="mt-4 flex items-center gap-1.5 text-sm font-medium text-royal">
            Read full story
            <ArrowIcon className="h-4 w-4 rotate-180 transition-transform duration-300 ease-out group-hover:translate-x-1" />
          </div>
        </div>
      </a>
    </motion.article>
  );
}
