// Filter chips shown in the FilterCarousel. "All" is the catch-all view.
export const CATEGORIES = ["All", "Funding", "AI", "Web3"] as const;

export type Filter = (typeof CATEGORIES)[number];

// A concrete category an article can be tagged with. "General" is the fallback
// for items the ingestion pipeline can't confidently bucket.
export type Category = Exclude<Filter, "All"> | "General";

/**
 * Canonical article shape used across the UI.
 *
 * Mirrors the Turso `articles` table (title, summary, source, url,
 * published_date, category) so the API route can swap mock data for a real
 * DB/RSS query without the frontend changing. `id` and `image` are UI-side
 * conveniences — `image` is optional because RSS items don't always carry one.
 */
export interface Article {
  id: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  published_date: string; // ISO 8601 string
  category: Category;
  image?: string;
}

export interface NewsResponse {
  articles: Article[];
  count: number;
  generatedAt: string;
}
