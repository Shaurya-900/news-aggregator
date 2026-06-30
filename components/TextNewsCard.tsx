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
        borderBottom: "1px solid rgba(26,18,8,0.1)",
        paddingBottom: "0.9rem",
        marginBottom: "0.9rem",
      }}
      className="group last:border-b-0"
    >
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}
      >
        {/* Source + date */}
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span
            style={{
              fontFamily: "'IM Fell English', serif",
              fontSize: "10px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#c9a87c",
              fontWeight: 700,
            }}
          >
            {article.source}
          </span>
          <span style={{ color: "#a8836a", fontSize: "10px" }}>·</span>
          <time
            dateTime={article.published_date}
            style={{
              fontFamily: "'IM Fell English', serif",
              fontSize: "10px",
              color: "#6b5a3e",
              fontStyle: "italic",
            }}
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
            fontSize: "0.9rem", // Increased from 0.82rem
            fontWeight: 700,
            lineHeight: 1.4,
            color: "#1a1208",
            margin: 0,
            transition: "color 0.2s, text-decoration-color 0.2s",
            textDecoration: "underline",
            textDecorationColor: "transparent", // Hidden initially
            textUnderlineOffset: "3px",
            textDecorationThickness: "1.5px",
          }}
          className="group-hover:text-[#c9a87c] group-hover:decoration-[#c9a87c] line-clamp-3"
        >
          {article.title}
        </h3>

        {/* Summary */}
        {article.summary && (
          <p
            style={{
              fontFamily: "'IM Fell English', serif",
              fontSize: "11px",
              lineHeight: 1.6,
              color: "#6b5a3e",
              margin: 0,
              fontStyle: "italic",
            }}
            className="line-clamp-2"
          >
            {article.summary}
          </p>
        )}

        {/* Category pill */}
        <span
          style={{
            fontFamily: "'IM Fell English', serif",
            fontSize: "9.5px",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#a8836a",
            border: "1px solid #c9a87c",
            padding: "1px 6px",
            display: "inline-block",
            marginTop: "2px",
            width: "fit-content",
          }}
        >
          {article.category}
        </span>
      </a>
    </motion.article>
  );
}
