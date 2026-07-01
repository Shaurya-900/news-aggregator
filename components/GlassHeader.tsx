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
      style={{ backgroundColor: "#faf8f4", borderBottom: "none" }}
      className="sticky top-0 z-50"
    >
      <link
        href="https://fonts.googleapis.com/css2?family=UnifrakturMaguntia&family=IM+Fell+English:ital@0;1&family=Manrope:wght@400;700;800&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap"
        rel="stylesheet"
      />

      {/* Top rule — double */}
      <div style={{ borderTop: "3px double #3D2412", margin: "0" }} />

      {/* Meta bar */}
      <div
        className="w-full flex justify-between items-center px-6"
        style={{ padding: "6px 1.5rem" }}
      >
        <div
          className="flex items-center hidden sm:flex"
          style={{ width: "220px" }}
        >
          <ECellLogo className="h-7 w-auto opacity-80" />
        </div>

        <span
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "10px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "rgba(61, 36, 18, 0.6)",
            flex: 1,
            textAlign: "center",
          }}
          className="hidden sm:block"
        >
          Shiv Nadar University · E-Cell
        </span>

        <span
          suppressHydrationWarning
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "10px",
            letterSpacing: "0.12em",
            color: "rgba(61, 36, 18, 0.6)",
            width: "220px",
            textAlign: "right",
          }}
          className="hidden sm:block"
        >
          {new Date().toLocaleDateString("en-IN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>

        {/* Mobile-only fallback: logo + date inline, no eyebrow text */}
        <div className="flex sm:hidden items-center justify-between w-full">
          <ECellLogo className="h-7 w-auto opacity-80" />
          <span
            suppressHydrationWarning
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "10px",
              letterSpacing: "0.12em",
              color: "rgba(61, 36, 18, 0.6)",
            }}
          >
            {new Date().toLocaleDateString("en-IN", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* Thin rule */}
      <div style={{ borderTop: "1px solid #3D2412", margin: "0" }} />

      {/* Masthead + search */}
      <div
        className="w-full flex items-center justify-between px-6"
        style={{ padding: "10px 1.5rem" }}
      >
        <div className="hidden sm:block" style={{ width: "220px" }} />

        <h1
          style={{
            fontFamily: "'UnifrakturMaguntia', cursive",
            fontSize: "clamp(2rem, 4vw, 3.4rem)",
            color: "#000000",
            letterSpacing: "0.02em",
            lineHeight: 1,
            textAlign: "center",
            flex: 1,
          }}
        >
          E-Cell Gazette
        </h1>

        {/* Search */}
        <div
          className="hidden sm:flex items-center gap-2 hover:border-[#b8916a] focus-within:border-[#b8916a] focus-within:shadow-[0_4px_12px_rgba(184,145,106,0.15)] hover:shadow-[0_2px_6px_rgba(184,145,106,0.1)] focus-within:-translate-y-[1.5px] transition-all duration-200"
          style={{
            width: "220px",
            border: "1px solid rgba(184, 145, 106, 0.6)",
            borderRadius: "2px",
            padding: "5px 12px",
            backgroundColor: "#faf8f4",
          }}
        >
          <Search
            style={{ width: 14, height: 14, color: "rgba(61, 36, 18, 0.6)", flexShrink: 0 }}
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
              color: "#3D2412",
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
                  color: "#b8916a",
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
          className="sm:hidden text-[rgba(61,36,18,0.7)] hover:text-[#b8916a] transition-colors duration-200 cursor-pointer"
          style={{
            background: "none",
            border: "none",
          }}
        >
          <Search style={{ width: 18, height: 18 }} />
        </button>
      </div>

      {/* Mobile search bar */}
      <div id="mobile-search" className="hidden sm:hidden px-6 pb-2">
        <div
          className="hover:border-[#b8916a] focus-within:border-[#b8916a] focus-within:shadow-[0_4px_12px_rgba(184,145,106,0.15)] hover:shadow-[0_2px_6px_rgba(184,145,106,0.1)] focus-within:-translate-y-[1.5px] transition-all duration-200"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            border: "1px solid rgba(184, 145, 106, 0.6)",
            borderRadius: 2,
            padding: "5px 12px",
          }}
        >
          <Search style={{ width: 14, height: 14, color: "rgba(61, 36, 18, 0.6)" }} />
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
              color: "#3D2412",
              width: "100%",
            }}
          />
        </div>
      </div>

      {/* Thin rule */}
      <div style={{ borderTop: "1px solid #3D2412", margin: "0" }} />

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
              fontWeight: activeCategory === section ? 700 : 400,
              padding: "2px 18px",
              borderLeft: i === 0 ? "1px solid #3D2412" : "none",
              borderRight: "1px solid #3D2412",
              background: "none",
            }}
            className={`group cursor-pointer transition-colors duration-200 ${activeCategory === section ? "text-[#b8916a]" : "text-[rgba(61,36,18,0.7)] hover:text-[#b8916a]"
              }`}
          >
            <span
              style={{
                borderBottom: "1.5px solid",
                borderColor: activeCategory === section ? "#b8916a" : "transparent",
                paddingBottom: "2px",
                transition: "border-color 0.2s ease-out",
              }}
              className="group-hover:border-[#b8916a]"
            >
              {section}
            </span>
          </button>
        ))}
      </nav>

      {/* Bottom double rule */}
      <div style={{ borderTop: "3px double #3D2412", margin: "0" }} />
    </header>
  );
}
