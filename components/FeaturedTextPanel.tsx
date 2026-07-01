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
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Minimum distance to trigger swipe (in px)
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    const itemsCount = articles.length;
    if (isLeftSwipe) {
      setCurrent((prev) => (prev + 1) % itemsCount);
    } else if (isRightSwipe) {
      setCurrent((prev) => (prev - 1 + itemsCount) % itemsCount);
    }
  };

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
      className="relative border border-black overflow-hidden flex flex-col transition-shadow duration-300 hover:shadow-[0_12px_30px_rgba(61,36,18,0.3)]"
      style={{ background: "#3D2412", minHeight: "200px" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* top label bar */}
      <div
        className="flex items-center justify-between px-6 py-3 border-b border-white/20"
        style={{ fontFamily: "'IM Fell English', serif" }}
      >
        <span className="text-[10px] tracking-[0.2em] uppercase text-white/60">
          Editor's Picks
        </span>
        <div className="flex gap-1.5">
          {articles.slice(0, 8).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === current
                  ? "bg-[#b8916a] scale-125"
                  : "bg-white/30 hover:bg-[#b8916a] hover:scale-120 cursor-pointer"
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
          className="flex flex-col flex-1 px-6 py-4 group"
        >
          <div
            className="text-[10px] tracking-[0.15em] uppercase text-white/60 mb-2"
            style={{ fontFamily: "'IM Fell English', serif" }}
          >
            {article.source} · {formatDate(article.published_date)} ·{" "}
            {article.category}
          </div>

          <h3
            className="text-base font-bold leading-snug text-white mb-2 group-hover:text-[#b8916a] transition-colors"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {article.title}
          </h3>

          <p className="text-xs leading-relaxed text-white/70 line-clamp-2 mb-3">
            {article.summary}
          </p>

          <div
            className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-white/70 group-hover:text-[#b8916a] transition-colors mt-auto read-story-link-dark"
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
