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
    ? "text-2xl sm:text-3xl leading-[1.1] text-black group-hover:text-[#3D2412] line-clamp-3"
    : "text-base font-bold leading-snug text-black group-hover:text-[#3D2412] line-clamp-2";

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
        borderBottom: "1px solid rgba(61,36,18,0.12)",
        padding: "0.8rem",
        paddingBottom: "1.2rem",
        marginBottom: "1.2rem",
        transition: "transform 0.2s ease-out, box-shadow 0.2s ease-out",
      }}
      className="group hover:-translate-y-[1.5px] hover:shadow-[0_6px_18px_rgba(61,36,18,0.10)] cursor-pointer"
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
              transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
              borderRadius: "2px",
            }}
            className="group-hover:shadow-[0_12px_24px_rgba(61,36,18,0.25)] group-hover:-translate-y-1"
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                overflow: "hidden",
                backgroundColor: "#e8e0d0",
                borderRadius: "2px",
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
          </div>
        )}

        <div
          style={{ display: "flex", alignItems: "center", gap: "6px" }}
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
          <span style={{ color: "rgba(61, 36, 18, 0.4)" }}>·</span>
          <span
            style={{
              fontFamily: "'IM Fell English', serif",
              color: "#b8916a",
              border: "1px solid #b8916a",
              padding: "1px 6px",
              display: "inline-block",
              transition: "color 0.2s ease-out, border-color 0.2s ease-out, background-color 0.2s ease-out",
            }}
            className="hover:bg-[rgba(184,145,106,0.08)] hover:text-[#9c7b5a] hover:border-[#9c7b5a] cursor-pointer"
          >
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
            fontFamily: "'Playfair Display', serif",
            margin: 0,
            fontWeight: featured ? 800 : 700,
            letterSpacing: featured ? "-0.01em" : "normal",
            transition: "color 0.2s",
          }}
          className={headlineClass}
        >
          {article.title}
        </h3>

        <p style={{ color: "rgba(61, 36, 18, 0.8)", margin: 0 }} className={summaryClass}>
          {article.summary}
        </p>

        <span
          style={{
            fontFamily: "'IM Fell English', serif",
            color: "rgba(61, 36, 18, 0.7)",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
          className="text-[10px] uppercase tracking-widest group-hover:text-[#3D2412] read-story-link-light"
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