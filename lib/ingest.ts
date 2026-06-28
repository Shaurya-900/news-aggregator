import Parser from "rss-parser";
import { ensureSchema, insertArticle, type ArticleInput } from "./db";
import type { Category } from "./types";

/** RSS sources to aggregate. Add or remove feeds here. */
const RSS_FEEDS = [
  "https://techcrunch.com/feed/",
  "https://thestartupmag.com/feed",
  "https://startupdaily.net/feed",
  "https://www.eu-startups.com/feed",
  "https://www.ycombinator.com/blog/rss",
];

/**
 * Lightweight relevance gate. Feeds are already startup-focused, but this drops
 * obvious off-topic items. Matched against the title + summary (lowercased).
 */
const RELEVANCE_KEYWORDS = [
  "startup",
  "founder",
  "funding",
  "raise",
  "raised",
  "seed",
  "series",
  "venture",
  "vc",
  "investment",
  "investor",
  "valuation",
  "acquire",
  "acquisition",
  "ai",
  "launch",
  "pitch",
  "accelerator",
  "incubator",
  "web3",
  "crypto",
];

// Category detection. Order matters — the first bucket that matches wins.
const CATEGORY_RULES: { category: Category; keywords: string[] }[] = [
  {
    category: "Web3",
    keywords: [
      "web3",
      "crypto",
      "blockchain",
      "bitcoin",
      "ethereum",
      "token",
      "defi",
      "nft",
      "on-chain",
      "onchain",
    ],
  },
  {
    category: "Funding",
    keywords: [
      "funding",
      "raises",
      "raised",
      "series a",
      "series b",
      "series c",
      "seed round",
      "pre-seed",
      "valuation",
      "venture",
      "investment",
      "million",
      "billion",
      "$",
    ],
  },
  {
    category: "AI",
    keywords: [
      "ai",
      "artificial intelligence",
      "machine learning",
      "llm",
      "gpt",
      "openai",
      "anthropic",
      "agent",
      "neural",
      "model",
    ],
  },
];

// Extra RSS fields we want for image extraction.
type FeedItem = {
  title?: string;
  link?: string;
  pubDate?: string;
  isoDate?: string;
  content?: string;
  contentSnippet?: string;
  "content:encoded"?: string;
  enclosure?: { url?: string; type?: string };
  "media:content"?: { $?: { url?: string; medium?: string; type?: string } };
  "media:thumbnail"?: { $?: { url?: string } };
};

const parser: Parser<unknown, FeedItem> = new Parser({
  timeout: 15000,
  headers: { "User-Agent": "ECell-News-Aggregator/1.0 (+https://snu.edu.in)" },
  customFields: {
    item: [
      "content:encoded",
      ["media:content", "media:content"],
      ["media:thumbnail", "media:thumbnail"],
    ],
  },
});

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#8217;|&rsquo;/g, "'")
    .replace(/&#8216;|&lsquo;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function buildSummary(item: FeedItem): string {
  const raw =
    item.contentSnippet ||
    stripHtml(item.content || item["content:encoded"] || "");
  return raw.length > 280 ? `${raw.slice(0, 277).trimEnd()}…` : raw;
}

function extractImage(item: FeedItem): string | null {
  if (item.enclosure?.url && item.enclosure.type?.startsWith("image")) {
    return item.enclosure.url;
  }
  if (item["media:content"]?.$?.url) {
    const m = item["media:content"].$;
    if (!m.medium || m.medium === "image" || m.type?.startsWith("image")) {
      return m.url ?? null;
    }
  }
  if (item["media:thumbnail"]?.$?.url) {
    return item["media:thumbnail"].$.url ?? null;
  }
  // Fall back to the first <img> in the article body.
  const body = item["content:encoded"] || item.content || "";
  const match = body.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match ? match[1] : null;
}

/**
 * Build a keyword matcher. Short acronyms (≤3 chars, e.g. "ai", "vc", "gpt")
 * are matched on word boundaries so they don't trigger inside unrelated words
 * like "email" or "retail"; longer keywords use plain substring matching so
 * stems still match ("raise" → "raised", "model" → "models").
 */
function compileMatcher(keywords: string[]): (text: string) => boolean {
  const loose: string[] = [];
  const strict: RegExp[] = [];
  for (const kw of keywords) {
    if (kw.length <= 3 && /^[a-z0-9]+$/.test(kw)) {
      strict.push(new RegExp(`\\b${kw}\\b`, "i"));
    } else {
      loose.push(kw.toLowerCase());
    }
  }
  return (text: string) => {
    const lower = text.toLowerCase();
    return loose.some((k) => lower.includes(k)) || strict.some((r) => r.test(text));
  };
}

const matchesRelevance = compileMatcher(RELEVANCE_KEYWORDS);
const categoryMatchers = CATEGORY_RULES.map((rule) => ({
  category: rule.category,
  test: compileMatcher(rule.keywords),
}));

function categorize(text: string): Category {
  for (const matcher of categoryMatchers) {
    if (matcher.test(text)) return matcher.category;
  }
  return "General";
}

/** Parse a feed date safely, falling back to "now" for missing/invalid values. */
function toISODate(item: FeedItem): string {
  const candidate = item.isoDate || item.pubDate;
  if (candidate) {
    const date = new Date(candidate);
    if (!Number.isNaN(date.getTime())) return date.toISOString();
  }
  return new Date().toISOString();
}

export interface IngestResult {
  ok: boolean;
  feedsProcessed: number;
  itemsSeen: number;
  inserted: number;
  skippedExisting: number;
  errors: { feed: string; message: string }[];
  durationMs: number;
}

/**
 * Fetch all feeds, filter + categorize the items, and upsert them into Turso.
 * Designed to be safe to run repeatedly (dedupes by URL) and resilient to a
 * single feed failing.
 */
export async function ingestFeeds(): Promise<IngestResult> {
  const startedAt = Date.now();
  await ensureSchema();

  let itemsSeen = 0;
  let inserted = 0;
  let skippedExisting = 0;
  const errors: { feed: string; message: string }[] = [];

  for (const feedUrl of RSS_FEEDS) {
    try {
      const feed = await parser.parseURL(feedUrl);
      const source = feed.title || new URL(feedUrl).hostname;

      for (const item of feed.items as FeedItem[]) {
        if (!item.title || !item.link) continue;

        const summary = buildSummary(item);
        const haystack = `${item.title} ${summary}`;
        if (!matchesRelevance(haystack)) continue;

        itemsSeen++;

        const article: ArticleInput = {
          title: stripHtml(item.title),
          summary,
          source,
          url: item.link,
          published_date: toISODate(item),
          category: categorize(`${haystack} ${source}`),
          image_url: extractImage(item),
        };

        const wasInserted = await insertArticle(article);
        if (wasInserted) inserted++;
        else skippedExisting++;
      }
    } catch (error) {
      errors.push({
        feed: feedUrl,
        message: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return {
    ok: errors.length < RSS_FEEDS.length, // ok unless every feed failed
    feedsProcessed: RSS_FEEDS.length,
    itemsSeen,
    inserted,
    skippedExisting,
    errors,
    durationMs: Date.now() - startedAt,
  };
}
