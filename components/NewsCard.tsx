"use client";

import { motion } from "framer-motion";
import type { Article } from "@/lib/types";

interface NewsCardProps {
  article: Article;
  index: number;
  featured?: boolean;
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

export function NewsCard({ article, index, featured = false }: NewsCardProps) {
  const headlineClass = featured
    ? "text-2xl sm:text-3xl leading-[1.1] group-hover:text-[#c9a87c] line-clamp-3"
    : "text-base font-bold leading-snug group-hover:text-[#c9a87c] line-clamp-2";

  const summaryClass = featured
    ? "text-sm leading-relaxed line-clamp-3"
    : "text-xs leading-relaxed line-clamp-2";

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: { delay: index * 0.045, duration: 0.35, ease: "easeOut" },
      }}
      exit={{ opacity: 0, y: -8, transition: { duration: 0.2 } }}
      style={{
        borderBottom: "1px solid rgba(26,18,8,0.12)",
        paddingBottom: "1.1rem",
        marginBottom: "1.1rem",
      }}
      className="group"
    >
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}
      >
    
        {article.image && (
          <div
            style={{
              width: "100%",
              aspectRatio: "3/2",
              overflow: "hidden",
              backgroundColor: "#e8e0d0",
            }}
          >
            <img
              src={article.image}
              alt=""
              loading="lazy"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: "transform 0.5s ease",
              }}
              className="group-hover:scale-[1.03]"
            />
          </div>
        )}

        <div
          style={{ display: "flex", alignItems: "center", gap: "6px" }}
          className="text-[10px] tracking-[0.15em] uppercase"
        >
          <span
            style={{
              fontFamily: "'IM Fell English', serif",
              color: "#c9a87c",
              fontWeight: 700,
            }}
          >
            {article.source}
          </span>
          <span style={{ color: "#a8836a" }}>·</span>
          <time
            dateTime={article.published_date}
            style={{ fontFamily: "'IM Fell English', serif", color: "#6b5a3e" }}
          >
            {formatDate(article.published_date)}
          </time>
          <span style={{ color: "#a8836a" }}>·</span>
          <span style={{ fontFamily: "'IM Fell English', serif", color: "#6b5a3e" }}>
            {article.category}
          </span>
        </div>

        <h3
          onMouseEnter={(e) => {
            e.currentTarget.style.textDecoration = "underline";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.textDecoration = "none";
          }}
          style={{
            fontFamily: "'Manrope', sans-serif",
            color: "#1a1208",
            margin: 0,
            fontWeight: featured ? 800 : 700,
            letterSpacing: featured ? "-0.01em" : "normal",
            transition: "color 0.2s",
          }}
          className={headlineClass}
        >
          {article.title}
        </h3>

        <p style={{ color: "#4a3f2f", margin: 0 }} className={summaryClass}>
          {article.summary}
        </p>

        <span
          style={{
            fontFamily: "'IM Fell English', serif",
            color: "#a8836a",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            transition: "color 0.2s",
          }}
          className="text-[10px] uppercase tracking-widest group-hover:text-[#1a1208]"
        >
          Read full story
          <span
            style={{ display: "inline-block", transition: "transform 0.25s" }}
            className="group-hover:translate-x-1"
          >
            →
          </span>
        </span>
      </a>
    </motion.article>
  );
}