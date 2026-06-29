"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { GlassHeader } from "@/components/GlassHeader";
import { FeedLayout } from "@/components/FeedLayout";
import { LoadingScreen } from "@/components/LoadingScreen";
import { type Article, type Filter } from "@/lib/types";


export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [active, setActive] = useState<Filter>("All");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadNews() {
      try {
        const res = await fetch("/api/news");
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const data = await res.json();
        if (!cancelled) setArticles(data.articles ?? []);
      } catch (error) {
        console.error("Failed to load news:", error);
      } finally {
        if (!cancelled) setTimeout(() => setLoading(false), 600);
      }
    }

    loadNews();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredArticles = useMemo(() => {
    const byCategory =
      active === "All"
        ? articles
        : articles.filter((a) => a.category === active);

    const q = query.trim().toLowerCase();
    if (!q) return byCategory;

    return byCategory.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q) ||
        a.source.toLowerCase().includes(q),
    );
  }, [active, articles, query]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <AnimatePresence>
        {loading && <LoadingScreen key="loading-screen" />}
      </AnimatePresence>

      <GlassHeader
        query={query}
        onQueryChange={setQuery}
        activeCategory={active}
        onCategoryChange={(cat) => setActive(cat as Filter)}
      />

      <main
        style={{ flex: 1, overflowY: "auto", minWidth: 0 }}
        className="mx-auto w-full max-w-[1500px] px-3 sm:px-6"
      >
        <FeedLayout articles={filteredArticles} />
      </main>
      
    </div>
  );
}
