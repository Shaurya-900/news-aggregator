import { NextResponse } from "next/server";
import { getArticles } from "@/lib/db";
import type { NewsResponse } from "@/lib/types";

// @libsql/client requires the Node.js runtime.
export const runtime = "nodejs";
// Render per-request, but the Cache-Control header lets Vercel's CDN serve a
// cached copy for 5 minutes (matching the feed's freshness needs).
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const articles = await getArticles();

    const payload: NewsResponse = {
      articles,
      count: articles.length,
      generatedAt: new Date().toISOString(),
    };

    return NextResponse.json(payload, {
      headers: {
        // Serve from the edge cache for 5 min, then revalidate in the
        // background while still serving the stale copy for up to 10 min.
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("GET /api/news failed:", error);
    return NextResponse.json(
      { error: "Failed to load news." },
      { status: 500 },
    );
  }
}
