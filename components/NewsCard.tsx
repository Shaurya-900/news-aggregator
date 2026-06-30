"use client";

import { motion } from "framer-motion";
import type { Article } from "@/lib/types";

interface NewsCardProps {
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

export function NewsCard({ article, index }: NewsCardProps) {
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
        // px-4 on mobile gives the text breathing room from the screen edge;
        // sm:px-0 removes it on desktop, where the column layout already spaces
        // things out. The image cancels this padding (below) to stay full-bleed.
        className="px-4 sm:px-0"
        style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}
      >
        {article.image && (
          <div
            // -mx-4 on mobile bleeds the image back out to the full screen width
            // (cancelling the <a>'s px-4); sm:mx-0 leaves desktop untouched.
            className="-mx-4 sm:mx-0"
            style={{
              // Most RSS thumbnails arrive at ~16:9, so matching the box to that
              // ratio means `cover` barely crops them — far less "cut off" than
              // the old 3:2 box, which lopped the sides off every wide image.
              // width is auto (not 100%) so the negative margin can expand it.
              aspectRatio: "16/9",
              overflow: "hidden",
              backgroundColor: "#e8e0d0",
            }}
          >
            <img
              src={article.image}
              alt={article.title}
              loading="lazy"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
                transition: "transform 0.5s ease",
              }}
              className="group-hover:scale-[1.03]"
            />
          </div>
        )}

        {/* Meta */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
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
          <span style={{ color: "#a8836a", fontSize: "10px" }}>·</span>
          <span
            style={{
              fontFamily: "'IM Fell English', serif",
              fontSize: "10px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#6b5a3e",
            }}
          >
            {article.category}
          </span>
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
            fontSize: "1.05rem",
            fontWeight: 700,
            lineHeight: 1.35,
            color: "#1a1208",
            margin: 0,
            transition: "color 0.2s",
          }}
          className="group-hover:text-[#c9a87c] line-clamp-2"
        >
          {article.title}
        </h3>

        {/* Summary */}
        <p
          style={{
            fontFamily: "'IM Fell English', serif",
            fontSize: "12.5px",
            lineHeight: 1.65,
            color: "#4a3f2f",
            margin: 0,
            fontStyle: "italic",
          }}
          className="line-clamp-2"
        >
          {article.summary}
        </p>

        {/* Read link */}
        <span
          style={{
            fontFamily: "'IM Fell English', serif",
            fontSize: "10px",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#a8836a",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            transition: "color 0.2s",
          }}
          className="group-hover:text-[#1a1208]"
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
