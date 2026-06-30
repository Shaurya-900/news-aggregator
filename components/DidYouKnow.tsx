"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQUOn_8yfuqDLVXuUAiTo5S0AiCP6INX0D0TEWdt73ymmFOuCtgBZE6Fogy6-V1FQcKlYnrqh4mefxW/pub?output=csv";

async function fetchFacts(): Promise<string[]> {
  try {
    const res = await fetch(CSV_URL);
    const text = await res.text();
    return text
      .split("\n")
      .map((line) => line.replace(/^"|"$/g, "").trim())
      .filter(Boolean)
      .slice(1);
  } catch {
    return [];
  }
}

function pickRandom<T>(arr: T[], n: number): T[] {
  return [...arr].sort(() => Math.random() - 0.5).slice(0, n);
}

let cachedFacts: string[] | null = null;

async function getSharedFacts(): Promise<string[]> {
  if (!cachedFacts) {
    const all = await fetchFacts();
    cachedFacts = pickRandom(all, 8);
  }
  return cachedFacts;
}

export function DidYouKnowStrip() {
  const [facts, setFacts] = useState<string[]>([]);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    getSharedFacts().then((picked) => setFacts(picked));
  }, []);

  useEffect(() => {
    // Detect touch/no-hover devices once on mount
    const touchCapable =
      window.matchMedia("(hover: none)").matches || "ontouchstart" in window;
    setIsTouch(touchCapable);
  }, []);

  // 3-second auto-advance matching the structural logic of FeaturedTextPanel
  useEffect(() => {
    if (facts.length <= 1 || paused) return;
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % facts.length);
    }, 3000); // 3 seconds
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [facts.length, paused]);

  if (facts.length === 0) return null;

  const fact = facts[current];

  // On touch devices: tap toggles pause/resume, no hover handlers.
  // On non-touch (laptop/desktop): hover pauses, leaving resumes, click does nothing extra.
  const hoverHandlers = isTouch
    ? {}
    : {
        onMouseEnter: () => setPaused(true),
        onMouseLeave: () => setPaused(false),
      };

  const clickHandler = isTouch ? { onClick: () => setPaused((p) => !p) } : {};

  return (
    <div
      className="relative border border-black overflow-hidden flex flex-col group"
      style={{ background: "#3b2a1a", minHeight: "200px" }}
      {...hoverHandlers}
      {...clickHandler}
    >
      {/* top label bar */}
      <div
        className="flex items-center justify-between px-4 py-2 border-b border-white/20 w-100"
        style={{ fontFamily: "'IM Fell English', serif" }}
      >
        <span className="text-[10px] tracking-[0.2em] uppercase text-white/60">
          Did You Know{" "}
          {paused && <span className="ml-2 text-white/30">— paused</span>}
        </span>
        <div className="flex gap-1.5">
          {facts.slice(0, 8).map((_, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                setCurrent(i);
              }}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                i === current
                  ? "bg-white/90 scale-125"
                  : "bg-white/25 hover:bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>

      {/* rotating fact card text block */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, y: 10 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: { duration: 0.35, ease: "easeOut" },
          }}
          exit={{ opacity: 0, y: -8, transition: { duration: 0.2 } }}
          className="flex flex-col flex-1 px-6 justify-center items-center text-center"
        >
          {/* Default changed from text-white/90 to text-white/60 for a deeper grey baseline */}
          <h3
            className="text-base font-bold leading-snug text-white/60 transition-colors duration-300 ease-in-out group-hover:text-white"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {fact}
          </h3>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
