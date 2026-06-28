"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { GlassHeader } from "@/components/GlassHeader";
import { FilterCarousel } from "@/components/FilterCarousel";
import { FeedLayout } from "@/components/FeedLayout";
import { LoadingScreen } from "@/components/LoadingScreen";
import { CATEGORIES, type Article, type Filter } from "@/lib/types";

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
        // Brief hold so the logo splash reads as intentional, not a flicker.
        if (!cancelled) setTimeout(() => setLoading(false), 600);
      }
    }

    loadNews();
    return () => {
      cancelled = true;
    };
  }, []);

  // Frontend filtering: narrow by category, then by the search query (matched
  // against title, summary, and source).
  const filteredArticles = useMemo(() => {
    const byCategory =
      active === "All"
        ? articles
        : articles.filter((article) => article.category === active);

    const q = query.trim().toLowerCase();
    if (!q) return byCategory;

    return byCategory.filter(
      (article) =>
        article.title.toLowerCase().includes(q) ||
        article.summary.toLowerCase().includes(q) ||
        article.source.toLowerCase().includes(q),
    );
  }, [active, articles, query]);

  return (
    <>
      <AnimatePresence>
        {loading && <LoadingScreen key="loading-screen" />}
      </AnimatePresence>

      <GlassHeader query={query} onQueryChange={setQuery} />
      <FilterCarousel
        categories={CATEGORIES}
        active={active}
        onChange={setActive}
      />

      <main>
        <FeedLayout articles={filteredArticles} />
      </main>
    </>
  );
}
