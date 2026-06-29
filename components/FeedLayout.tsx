"use client";

import { AnimatePresence } from "framer-motion";
import { NewsCard } from "./NewsCard";
import { TextNewsCard } from "./TextNewsCard";
import { FeaturedTextPanel } from "./FeaturedTextPanel";
import { DidYouKnowStrip } from "./DidYouKnow";
import type { Article } from "@/lib/types";

interface FeedLayoutProps {
  articles: Article[];
}

const SECTION_LABEL: React.CSSProperties = {
  fontFamily: "'IM Fell English', serif",
  fontSize: "10px",
  letterSpacing: "0.2em",
  textTransform: "uppercase",
  color: "#6b5a3e",
  marginBottom: "0.85rem",
  paddingBottom: "0.5rem",
  borderBottom: "1px solid rgba(26,18,8,0.18)",
  display: "block",
};

export function FeedLayout({ articles }: FeedLayoutProps) {
  const withImage = articles.filter((a) => a.image);
  const withoutImage = articles.filter((a) => !a.image);

  if (articles.length === 0) {
    return (
      <div
        style={{
          display: "grid",
          placeItems: "center",
          padding: "6rem 1.5rem",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: "'IM Fell English', serif",
            fontSize: "13px",
            color: "#a8836a",
            fontStyle: "italic",
          }}
        >
          No stories match — try a different category or search.
        </p>
      </div>
    );
  }

  const firstCard = withImage[0];
  const remainingStories = withImage.slice(1);
  const leftCards = remainingStories.filter((_, i) => i % 2 === 0);
  const rightCards = remainingStories.filter((_, i) => i % 2 === 1);

  return (
    <div style={{ padding: "0 1.5rem 2rem" }}>
      {/* Mobile Feed Layout */}
      <div
        className="flex flex-col gap-5 sm:hidden"
        style={{ paddingTop: "1rem" }}
      >
        {withoutImage.length > 0 && (
          <FeaturedTextPanel articles={withoutImage} />
        )}
        <DidYouKnowStrip />
        <AnimatePresence mode="popLayout">
          {withImage.map((article, index) => (
            <div key={article.id}>
              {index > 0 && index % 3 === 0 && <DidYouKnowStrip />}
              <div
                style={{
                  borderTop: "1px solid rgba(26,18,8,0.15)",
                  paddingTop: "1rem",
                }}
              >
                <NewsCard article={article} index={index} />
              </div>
            </div>
          ))}
        </AnimatePresence>
      </div>

      {/* Desktop Editorial Layout Grid */}
      <div
        className="hidden sm:flex gap-0"
        style={{ borderTop: "1px solid rgba(26,18,8,0.2)" }}
      >
        {/* Sidebar — More Stories */}
        <aside
          style={{
            width: "24%",
            flexShrink: 0,
            padding: "1.25rem 1.25rem 1.25rem 1rem",
            borderRight: "3px double rgba(26,18,8,0.25)",
            backgroundColor: "#f5f0e8",
          }}
        >
          <span style={SECTION_LABEL}>More Stories</span>
          <AnimatePresence mode="popLayout">
            {withoutImage.map((article, index) => (
              <TextNewsCard key={article.id} article={article} index={index} />
            ))}
          </AnimatePresence>
        </aside>

        {/* Main Content */}
        <main
          style={{ flex: 1, padding: "1.25rem 0 1.25rem 1.25rem", minWidth: 0 }}
        >
          <span style={SECTION_LABEL}>Top Stories</span>

          <div
            style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start" }}
          >
            {/* Left Column (55%) */}
            <div
              style={{
                width: "55%",
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
                minWidth: 0,
              }}
            >
              {firstCard && (
                <NewsCard key={firstCard.id} article={firstCard} index={0} />
              )}
              <AnimatePresence mode="popLayout">
                {leftCards.map((article, index) => {
                  const showDyk = index % 2 === 1;
                  return (
                    <div
                      key={article.id}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1.5rem",
                      }}
                    >
                      {showDyk && <DidYouKnowStrip />}
                      <NewsCard article={article} index={index + 1} />
                    </div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Right Column (45%) */}
            <div
              style={{
                width: "45%",
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
                minWidth: 0,
              }}
            >
              {withoutImage.length > 0 && (
                <FeaturedTextPanel articles={withoutImage} />
              )}
              <AnimatePresence mode="popLayout">
                {rightCards.map((article, index) => {
                  const showDyk = index > 0 && index % 3 === 0;
                  return (
                    <div
                      key={article.id}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1.5rem",
                      }}
                    >
                      {showDyk && <DidYouKnowStrip />}
                      <NewsCard article={article} index={index + 2} />
                    </div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
