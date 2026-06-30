"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ECellLogo } from "./ECellLogo";
import { Search, X } from "lucide-react";

interface GlassHeaderProps {
  query: string;
  onQueryChange: (value: string) => void;
  activeCategory?: string;
  onCategoryChange?: (category: string) => void;
}

const SECTIONS = ["All", "Funding", "AI", "Web3"];

export function GlassHeader({
  query,
  onQueryChange,
  activeCategory = "All",
  onCategoryChange,
}: GlassHeaderProps) {
  return (
    <header
      style={{ backgroundColor: "#faf8f3", borderBottom: "none" }}
      className="sticky top-0 z-50"
    >
      <link
        href="https://fonts.googleapis.com/css2?family=UnifrakturMaguntia&family=IM+Fell+English:ital@0;1&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap"
        rel="stylesheet"
      />

      {/* Top rule — double */}
      <div style={{ borderTop: "3px double #1a1208", margin: "0 1.5rem" }} />

      {/* Meta bar */}
      <div
        className="mx-auto max-w-[1500px] flex justify-between items-center px-6"
        style={{ padding: "6px 1.5rem" }}
      >
        <ECellLogo className="h-7 w-auto opacity-80" />
        <span
          style={{
            fontFamily: "'IM Fell English', serif",
            fontSize: "10px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#6b5a3e",
            fontStyle: "italic",
          }}
          className="hidden sm:block"
        >
          Shiv Nadar University · E-Cell
        </span>
        <span
          suppressHydrationWarning
          style={{
            fontFamily: "'IM Fell English', serif",
            fontSize: "10px",
            letterSpacing: "0.12em",
            color: "#6b5a3e",
            fontStyle: "italic",
          }}
        >
          {new Date().toLocaleDateString("en-IN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
      </div>

      {/* Thin rule */}
      <div style={{ borderTop: "1px solid #1a1208", margin: "0 1.5rem" }} />

      {/* Masthead + search */}
      <div
        className="mx-auto max-w-[1500px] flex items-center justify-between px-6"
        style={{ padding: "10px 1.5rem" }}
      >
        <div className="hidden sm:block" style={{ width: "220px" }} />

        <h1
          style={{
            fontFamily: "'UnifrakturMaguntia', cursive",
            fontSize: "clamp(2rem, 4vw, 3.4rem)",
            color: "#1a1208",
            letterSpacing: "0.02em",
            lineHeight: 1,
            textAlign: "center",
            flex: 1,
          }}
        >
          E-Cell Newsletter
        </h1>

        {/* Search */}
        <div
          className="hidden sm:flex items-center gap-2"
          style={{
            width: "220px",
            border: "1px solid #c9a87c",
            borderRadius: "2px",
            padding: "5px 12px",
            backgroundColor: "#faf8f3",
          }}
        >
          <Search
            style={{ width: 14, height: 14, color: "#a8836a", flexShrink: 0 }}
          />
          <input
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") onQueryChange("");
            }}
            placeholder="Search stories…"
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              fontFamily: "'IM Fell English', serif",
              fontSize: "12px",
              color: "#1a1208",
              width: "100%",
            }}
          />
          <AnimatePresence initial={false}>
            {query && (
              <motion.button
                key="clear"
                type="button"
                onClick={() => onQueryChange("")}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                style={{
                  color: "#a8836a",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <X style={{ width: 13, height: 13 }} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile search icon */}
        <button
          onClick={() => {
            const el = document.getElementById("mobile-search");
            el?.classList.toggle("hidden");
            el?.querySelector("input")?.focus();
          }}
          className="sm:hidden"
          style={{
            color: "#6b5a3e",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          <Search style={{ width: 18, height: 18 }} />
        </button>
      </div>

      {/* Mobile search bar */}
      <div id="mobile-search" className="hidden sm:hidden px-6 pb-2">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            border: "1px solid #c9a87c",
            borderRadius: 2,
            padding: "5px 12px",
          }}
        >
          <Search style={{ width: 14, height: 14, color: "#a8836a" }} />
          <input
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search stories…"
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              fontFamily: "'IM Fell English', serif",
              fontSize: "12px",
              color: "#1a1208",
              width: "100%",
            }}
          />
        </div>
      </div>

      {/* Thin rule */}
      <div style={{ borderTop: "1px solid #1a1208", margin: "0 1.5rem" }} />

      {/* Section nav */}
      <nav
        style={{ display: "flex", justifyContent: "center", padding: "5px 0" }}
      >
        {SECTIONS.map((section, i) => (
          <button
            key={section}
            onClick={() => onCategoryChange?.(section)}
            style={{
              fontFamily: "'IM Fell English', serif",
              fontSize: "11px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: activeCategory === section ? "#1a1208" : "#6b5a3e",
              fontWeight: activeCategory === section ? 700 : 400,
              textDecoration: activeCategory === section ? "underline" : "none",
              textUnderlineOffset: "3px",
              padding: "2px 18px",
              borderLeft: i === 0 ? "1px solid #1a1208" : "none",
              borderRight: "1px solid #1a1208",
              background: "none",
              cursor: "pointer",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => {
              if (activeCategory !== section)
                (e.target as HTMLElement).style.color = "#1a1208";
            }}
            onMouseLeave={(e) => {
              if (activeCategory !== section)
                (e.target as HTMLElement).style.color = "#6b5a3e";
            }}
          >
            {section}
          </button>
        ))}
      </nav>

      {/* Bottom double rule */}
      <div style={{ borderTop: "3px double #1a1208", margin: "0 1.5rem" }} />
    </header>
  );
}
