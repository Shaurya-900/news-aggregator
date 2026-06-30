"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowIcon } from "./ArrowIcon";
import type { Article } from "@/lib/types";

interface FeaturedTextPanelProps {
  articles: Article[];
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

export function FeaturedTextPanel({ articles }: FeaturedTextPanelProps) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (articles.length <= 1 || paused) return;
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % articles.length);
    }, 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [articles.length, paused]);

  if (articles.length === 0) return null;

  const article = articles[current];

  return (
    <div
      className="relative border border-black overflow-hidden flex flex-col"
      style={{ background: "#3b2a1a", minHeight: "200px" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* top label bar */}
      <div
        className="flex items-center justify-between px-4 py-2 border-b border-white/20"
        style={{ fontFamily: "'IM Fell English', serif" }}
      >
        <span className="text-[10px] tracking-[0.2em] uppercase text-white/60">
          Editor's Picks{" "}
          {paused && <span className="ml-2 text-white/30">— paused</span>}
        </span>
        <div className="flex gap-1.5">
          {articles.slice(0, 8).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                i === current
                  ? "bg-white/90 scale-125"
                  : "bg-white/25 hover:bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>

      {/* rotating article */}
      <AnimatePresence mode="wait">
        <motion.a
          key={article.id}
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 10 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: { duration: 0.35, ease: "easeOut" },
          }}
          exit={{ opacity: 0, y: -8, transition: { duration: 0.2 } }}
          className="flex flex-col flex-1 px-4 py-3 group"
        >
          <div
            className="text-[10px] tracking-[0.15em] uppercase text-white/45 mb-2"
            style={{ fontFamily: "'IM Fell English', serif" }}
          >
            {article.source} · {formatDate(article.published_date)} ·{" "}
            {article.category}
          </div>

          <h3
            className="text-base font-bold leading-snug text-white/90 mb-2 group-hover:text-white transition-colors"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {article.title}
          </h3>

          <p className="text-xs leading-relaxed text-white/50 line-clamp-2 mb-3">
            {article.summary}
          </p>

          <div
            className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-white/40 group-hover:text-white/70 transition-colors mt-auto"
            style={{ fontFamily: "'IM Fell English', serif" }}
          >
            Read full story
            <ArrowIcon className="h-3 w-3 rotate-180 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </motion.a>
      </AnimatePresence>
    </div>
  );
}
