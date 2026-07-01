"use client";

import { motion } from "framer-motion";
import type { Article } from "@/lib/types";

interface TextNewsCardProps {
  article: Article;
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

export function TextNewsCard({ article, index }: TextNewsCardProps) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: { delay: index * 0.04, duration: 0.28, ease: "easeOut" },
      }}
      exit={{ opacity: 0, y: -6, transition: { duration: 0.18 } }}
      style={{
        borderBottom: "1px solid rgba(61, 36, 18, 0.12)",
        paddingTop: "0.1rem",
        paddingBottom: "1.1rem",
        marginBottom: "0.9rem",
      }}
      className="group last:border-b-0 px-3 py-2 -mx-3 rounded-[3px] transition-colors duration-200 hover:bg-[rgba(61,36,18,0.03)] cursor-pointer"
    >
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}
      >
        {/* Source + date */}
        <div
          style={{ display: "flex", alignItems: "center", gap: 5 }}
          className="text-[10px] tracking-[0.15em] uppercase"
        >
          <span
            style={{
              fontFamily: "'IM Fell English', serif",
              color: "rgba(61, 36, 18, 0.6)",
              fontWeight: 700,
            }}
          >
            {article.source}
          </span>
          <span style={{ color: "rgba(61, 36, 18, 0.4)" }}>·</span>
          <time
            dateTime={article.published_date}
            style={{ fontFamily: "'IM Fell English', serif", color: "rgba(61, 36, 18, 0.6)" }}
          >
            {formatDate(article.published_date)}
          </time>
        </div>

        {/* Headline */}
        <h3
          onMouseEnter={(e) => {
            e.currentTarget.style.textDecoration = "underline";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.textDecoration = "none";
          }}
          style={{
            fontFamily: "'Playfair Display', serif",
            color: "#3D2412",
            margin: 0,
            fontWeight: 600,
            lineHeight: "1.38",
            transition: "color 0.2s, text-decoration-color 0.2s",
            textDecoration: "underline",
            textDecorationColor: "transparent",
            textUnderlineOffset: "3px",
            textDecorationThickness: "1.5px",
          }}
          className="text-[14.5px] group-hover:text-[#3D2412] group-hover:decoration-[#3D2412] line-clamp-3"
        >
          {article.title}
        </h3>

        {/* Summary */}
        {article.summary && (
          <p
            style={{ color: "rgba(61, 36, 18, 0.8)", margin: 0 }}
            className="text-xs leading-relaxed line-clamp-2"
          >
            {article.summary}
          </p>
        )}

        {/* Category pill */}
        <span
          style={{
            fontFamily: "'IM Fell English', serif",
            color: "#b8916a",
            border: "1px solid #b8916a",
            padding: "1px 6px",
            display: "inline-block",
            marginTop: "2px",
            width: "fit-content",
            transition: "color 0.2s ease-out, border-color 0.2s ease-out, background-color 0.2s ease-out",
          }}
          className="text-[9.5px] tracking-[0.14em] uppercase hover:bg-[rgba(184,145,106,0.08)] hover:text-[#9c7b5a] hover:border-[#9c7b5a] cursor-pointer"
        >
          {article.category}
        </span>
      </a>
    </motion.article>
  );
}