import { createClient, type Client } from "@libsql/client";
import type { Article, Category } from "./types";

/**
 * Turso (libSQL) client — a lazily-created singleton.
 *
 * Uses a direct remote connection (not the embedded replica) because the app
 * runs on Vercel serverless functions, where the filesystem is read-only and
 * not shared across invocations.
 */
let client: Client | null = null;

export function getTurso(): Client {
  if (client) return client;

  const url = process.env.TURSO_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url) {
    throw new Error("TURSO_URL is not set. Add it to your environment.");
  }

  client = createClient({ url, authToken });
  return client;
}

/**
 * Bring the `articles` table up to the schema this app expects.
 *
 * Non-destructive and idempotent: creates the table on a fresh database, and
 * on a pre-existing one (e.g. the earlier prototype's table) introspects the
 * columns and ALTERs in anything missing. A unique index on `url` backs the
 * `ON CONFLICT(url)` upsert in insertArticle.
 */
export async function ensureSchema(): Promise<void> {
  const turso = getTurso();

  await turso.execute(
    `CREATE TABLE IF NOT EXISTS articles (
        id             INTEGER PRIMARY KEY AUTOINCREMENT,
        title          TEXT NOT NULL,
        summary        TEXT,
        source         TEXT,
        url            TEXT NOT NULL UNIQUE,
        published_date TEXT,
        category       TEXT NOT NULL DEFAULT 'General',
        image_url      TEXT,
        created_at     TEXT NOT NULL DEFAULT (datetime('now'))
      )`,
  );

  // Add columns the table may predate (ALTER TABLE ADD COLUMN is a no-op-safe
  // migration; SQLite has no "ADD COLUMN IF NOT EXISTS", so we check first).
  const { rows } = await turso.execute("PRAGMA table_info(articles)");
  const existingColumns = new Set(rows.map((r) => String(r.name)));

  const columnMigrations: Record<string, string> = {
    image_url: "ALTER TABLE articles ADD COLUMN image_url TEXT",
    summary: "ALTER TABLE articles ADD COLUMN summary TEXT",
    category:
      "ALTER TABLE articles ADD COLUMN category TEXT NOT NULL DEFAULT 'General'",
    source: "ALTER TABLE articles ADD COLUMN source TEXT",
    published_date: "ALTER TABLE articles ADD COLUMN published_date TEXT",
    created_at:
      "ALTER TABLE articles ADD COLUMN created_at TEXT DEFAULT (datetime('now'))",
  };

  for (const [column, sql] of Object.entries(columnMigrations)) {
    if (!existingColumns.has(column)) {
      await turso.execute(sql);
    }
  }

  // Ensure the upsert target and the ordering index exist. The unique index is
  // best-effort — it only fails if the table already holds duplicate URLs.
  try {
    await turso.execute(
      "CREATE UNIQUE INDEX IF NOT EXISTS idx_articles_url ON articles (url)",
    );
  } catch (error) {
    console.warn(
      "Could not create unique index on articles.url:",
      error instanceof Error ? error.message : error,
    );
  }
  await turso.execute(
    "CREATE INDEX IF NOT EXISTS idx_articles_published ON articles (published_date DESC)",
  );
}

export interface ArticleInput {
  title: string;
  summary: string;
  source: string;
  url: string;
  published_date: string;
  category: Category;
  image_url?: string | null;
}

/**
 * Insert one article, ignoring duplicates by URL. Returns true if a new row
 * was written, false if it already existed.
 */
export async function insertArticle(article: ArticleInput): Promise<boolean> {
  const turso = getTurso();
  const result = await turso.execute({
    sql: `INSERT INTO articles
            (title, summary, source, url, published_date, category, image_url)
          VALUES (?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(url) DO NOTHING`,
    args: [
      article.title,
      article.summary,
      article.source,
      article.url,
      article.published_date,
      article.category,
      article.image_url ?? null,
    ],
  });
  return result.rowsAffected > 0;
}

/**
 * Fetch the most recent articles for the feed, newest first.
 * Self-heals on a fresh database: if the table doesn't exist yet (cron hasn't
 * run), it creates the schema and returns an empty list instead of throwing.
 */
export async function getArticles(limit = 60): Promise<Article[]> {
  const turso = getTurso();

  try {
    const { rows } = await turso.execute({
      sql: `SELECT rowid AS id, title, summary, source, url, published_date, category, image_url
              FROM articles
          ORDER BY published_date DESC
             LIMIT ?`,
      args: [limit],
    });
    return rows.map(mapRowToArticle);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes("no such table")) {
      await ensureSchema();
      return [];
    }
    throw error;
  }
}

function mapRowToArticle(row: Record<string, unknown>): Article {
  return {
    id: String(row.id),
    title: (row.title as string) ?? "",
    summary: (row.summary as string) ?? "",
    source: (row.source as string) ?? "",
    url: (row.url as string) ?? "",
    published_date: (row.published_date as string) ?? "",
    category: ((row.category as Category) ?? "General") satisfies Category,
    image: (row.image_url as string) || undefined,
  };
}
